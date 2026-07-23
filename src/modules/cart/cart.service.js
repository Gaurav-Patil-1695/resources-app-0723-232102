const db = require('../../db');
const AppError = require('../../utils/AppError');
const { HTTP_STATUS } = require('../../constants/httpStatus');

/**
 * Create a new cart for a user (authenticated) or guest.
 * If the user already has an active cart and a guestId cart exists, merge them.
 */
async function createCart({ userId, guestId }) {
  if (userId) {
    // Check for existing active cart for this user
    const existing = await db('carts')
      .where({ user_id: userId, status: 'active' })
      .first();

    if (existing) {
      // Merge guest cart into existing user cart if guestId provided
      if (guestId) {
        await mergeGuestCartIntoUserCart(guestId, existing.id);
      }
      return getCartById(existing.id, userId);
    }

    // Create new cart for user
    const [cartId] = await db('carts').insert({
      user_id: userId,
      status: 'active',
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    }).returning('id');

    const newCartId = cartId.id || cartId;

    if (guestId) {
      await mergeGuestCartIntoUserCart(guestId, newCartId);
    }

    return getCartById(newCartId, userId);
  }

  // Guest cart creation
  const [cartId] = await db('carts').insert({
    guest_id: guestId || null,
    status: 'active',
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  }).returning('id');

  const newCartId = cartId.id || cartId;
  return getCartById(newCartId, null);
}

/**
 * Merge all items from a guest cart into the target cart.
 * If the same product/variant exists in both, sum up quantities (respecting stock).
 */
async function mergeGuestCartIntoUserCart(guestId, targetCartId) {
  const guestCart = await db('carts')
    .where({ guest_id: guestId, status: 'active' })
    .first();

  if (!guestCart) return;

  const guestItems = await db('cart_items').where({ cart_id: guestCart.id });

  for (const guestItem of guestItems) {
    const existingItem = await db('cart_items')
      .where({
        cart_id: targetCartId,
        product_id: guestItem.product_id,
        variant_id: guestItem.variant_id,
      })
      .first();

    if (existingItem) {
      const newQuantity = existingItem.quantity + guestItem.quantity;
      const stock = await getAvailableStock(guestItem.product_id, guestItem.variant_id);
      const finalQuantity = Math.min(newQuantity, stock);

      await db('cart_items')
        .where({ id: existingItem.id })
        .update({
          quantity: finalQuantity,
          updated_at: db.fn.now(),
        });
    } else {
      await db('cart_items').insert({
        cart_id: targetCartId,
        product_id: guestItem.product_id,
        variant_id: guestItem.variant_id,
        quantity: guestItem.quantity,
        unit_price: guestItem.unit_price,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });
    }
  }

  // Mark guest cart as merged
  await db('carts').where({ id: guestCart.id }).update({ status: 'merged', updated_at: db.fn.now() });
}

/**
 * Retrieve a cart with its items by ID.
 * Validates ownership if userId is provided.
 */
async function getCartById(cartId, userId) {
  const cart = await db('carts').where({ id: cartId }).first();

  if (!cart) {
    throw new AppError('Cart not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', HTTP_STATUS.FORBIDDEN);
  }

  const items = await db('cart_items')
    .where({ cart_id: cartId })
    .select(
      'cart_items.id',
      'cart_items.product_id',
      'cart_items.variant_id',
      'cart_items.quantity',
      'cart_items.unit_price',
      'cart_items.created_at',
      'cart_items.updated_at'
    );

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const discount = cart.discount_amount || 0;
  const total = Math.max(0, subtotal - discount);

  return {
    id: cart.id,
    userId: cart.user_id,
    guestId: cart.guest_id,
    status: cart.status,
    promoCode: cart.promo_code,
    discountAmount: discount,
    subtotal,
    total,
    items,
    createdAt: cart.created_at,
    updatedAt: cart.updated_at,
  };
}

/**
 * Add an item to the cart.
 * Validates stock availability before insertion.
 */
async function addItem(cartId, { productId, variantId, quantity }, userId) {
  const cart = await db('carts').where({ id: cartId }).first();

  if (!cart) {
    throw new AppError('Cart not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', HTTP_STATUS.FORBIDDEN);
  }

  if (cart.status !== 'active') {
    throw new AppError('Cannot modify an inactive cart.', HTTP_STATUS.BAD_REQUEST);
  }

  // Fetch product/variant details
  const product = await db('products').where({ id: productId }).first();
  if (!product) {
    throw new AppError('Product not found.', HTTP_STATUS.NOT_FOUND);
  }

  let unitPrice = product.price;
  if (variantId) {
    const variant = await db('product_variants').where({ id: variantId, product_id: productId }).first();
    if (!variant) {
      throw new AppError('Product variant not found.', HTTP_STATUS.NOT_FOUND);
    }
    unitPrice = variant.price || unitPrice;
  }

  // Check stock
  const stock = await getAvailableStock(productId, variantId);
  if (stock < quantity) {
    throw new AppError('Insufficient stock for the requested quantity.', HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  // Check if item already exists in cart
  const existingItem = await db('cart_items')
    .where({ cart_id: cartId, product_id: productId, variant_id: variantId || null })
    .first();

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (stock < newQuantity) {
      throw new AppError('Insufficient stock for the requested quantity.', HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
    await db('cart_items')
      .where({ id: existingItem.id })
      .update({ quantity: newQuantity, updated_at: db.fn.now() });
  } else {
    await db('cart_items').insert({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId || null,
      quantity,
      unit_price: unitPrice,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
  }

  await db('carts').where({ id: cartId }).update({ updated_at: db.fn.now() });

  return getCartById(cartId, userId);
}

/**
 * Update the quantity of a cart item.
 * Validates stock availability.
 */
async function updateItem(cartId, itemId, { quantity }, userId) {
  const cart = await db('carts').where({ id: cartId }).first();

  if (!cart) {
    throw new AppError('Cart not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', HTTP_STATUS.FORBIDDEN);
  }

  if (cart.status !== 'active') {
    throw new AppError('Cannot modify an inactive cart.', HTTP_STATUS.BAD_REQUEST);
  }

  const item = await db('cart_items').where({ id: itemId, cart_id: cartId }).first();
  if (!item) {
    throw new AppError('Cart item not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (quantity <= 0) {
    // Remove the item if quantity is zero or negative
    await db('cart_items').where({ id: itemId }).delete();
  } else {
    const stock = await getAvailableStock(item.product_id, item.variant_id);
    if (stock < quantity) {
      throw new AppError('Insufficient stock for the requested quantity.', HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
    await db('cart_items')
      .where({ id: itemId })
      .update({ quantity, updated_at: db.fn.now() });
  }

  await db('carts').where({ id: cartId }).update({ updated_at: db.fn.now() });

  return getCartById(cartId, userId);
}

/**
 * Remove an item from the cart.
 */
async function removeItem(cartId, itemId, userId) {
  const cart = await db('carts').where({ id: cartId }).first();

  if (!cart) {
    throw new AppError('Cart not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', HTTP_STATUS.FORBIDDEN);
  }

  if (cart.status !== 'active') {
    throw new AppError('Cannot modify an inactive cart.', HTTP_STATUS.BAD_REQUEST);
  }

  const item = await db('cart_items').where({ id: itemId, cart_id: cartId }).first();
  if (!item) {
    throw new AppError('Cart item not found.', HTTP_STATUS.NOT_FOUND);
  }

  await db('cart_items').where({ id: itemId }).delete();
  await db('carts').where({ id: cartId }).update({ updated_at: db.fn.now() });

  return getCartById(cartId, userId);
}

/**
 * Apply a promo code to the cart.
 * Validates the promo code and calculates the discount.
 */
async function applyPromo(cartId, promoCode, userId) {
  const cart = await db('carts').where({ id: cartId }).first();

  if (!cart) {
    throw new AppError('Cart not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', HTTP_STATUS.FORBIDDEN);
  }

  if (cart.status !== 'active') {
    throw new AppError('Cannot modify an inactive cart.', HTTP_STATUS.BAD_REQUEST);
  }

  const promo = await db('promo_codes')
    .where({ code: promoCode, is_active: true })
    .first();

  if (!promo) {
    throw new AppError('Invalid or expired promo code.', HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  const now = new Date();
  if (promo.expires_at && new Date(promo.expires_at) < now) {
    throw new AppError('Invalid or expired promo code.', HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    throw new AppError('Promo code usage limit has been reached.', HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  // Calculate items subtotal
  const items = await db('cart_items').where({ cart_id: cartId });
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  let discountAmount = 0;
  if (promo.discount_type === 'percentage') {
    discountAmount = (subtotal * promo.discount_value) / 100;
  } else if (promo.discount_type === 'fixed') {
    discountAmount = promo.discount_value;
  }

  discountAmount = Math.min(discountAmount, subtotal);
  discountAmount = Math.round(discountAmount * 100) / 100;

  await db('carts').where({ id: cartId }).update({
    promo_code: promoCode,
    promo_code_id: promo.id,
    discount_amount: discountAmount,
    updated_at: db.fn.now(),
  });

  return getCartById(cartId, userId);
}

/**
 * Remove the applied promo code from the cart.
 */
async function removePromo(cartId, userId) {
  const cart = await db('carts').where({ id: cartId }).first();

  if (!cart) {
    throw new AppError('Cart not found.', HTTP_STATUS.NOT_FOUND);
  }

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', HTTP_STATUS.FORBIDDEN);
  }

  if (cart.status !== 'active') {
    throw new AppError('Cannot modify an inactive cart.', HTTP_STATUS.BAD_REQUEST);
  }

  if (!cart.promo_code) {
    throw new AppError('No promo code is applied to this cart.', HTTP_STATUS.BAD_REQUEST);
  }

  await db('carts').where({ id: cartId }).update({
    promo_code: null,
    promo_code_id: null,
    discount_amount: 0,
    updated_at: db.fn.now(),
  });

  return getCartById(cartId, userId);
}

/**
 * Helper: Get available stock for a product/variant.
 */
async function getAvailableStock(productId, variantId) {
  if (variantId) {
    const variant = await db('product_variants').where({ id: variantId, product_id: productId }).first();
    return variant ? (variant.stock_quantity || 0) : 0;
  }
  const product = await db('products').where({ id: productId }).first();
  return product ? (product.stock_quantity || 0) : 0;
}

module.exports = {
  createCart,
  getCartById,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
  mergeGuestCartIntoUserCart,
};
