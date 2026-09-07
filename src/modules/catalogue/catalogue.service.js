const db = require('../../db');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPagination(page, limit) {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (parsedPage - 1) * parsedLimit;
  return { parsedPage, parsedLimit, offset };
}

function buildProductSortClause(sortBy, sortOrder) {
  const allowedSortFields = ['name', 'price', 'created_at', 'updated_at'];
  const allowedSortOrders = ['ASC', 'DESC'];
  const field = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const order = allowedSortOrders.includes((sortOrder || '').toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  return `p.${field} ${order}`;
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function listProducts(filters = {}) {
  const { categoryId, brandId, minPrice, maxPrice, search, page, limit, sortBy, sortOrder } = filters;
  const { parsedPage, parsedLimit, offset } = buildPagination(page, limit);
  const sortClause = buildProductSortClause(sortBy, sortOrder);

  const conditions = ['p.deleted_at IS NULL'];
  const params = [];

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`p.category_id = $${params.length}`);
  }
  if (brandId) {
    params.push(brandId);
    conditions.push(`p.brand_id = $${params.length}`);
  }
  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    params.push(Number(minPrice));
    conditions.push(`p.base_price >= $${params.length}`);
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    params.push(Number(maxPrice));
    conditions.push(`p.base_price <= $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countParams = [...params];
  const countResult = await db.query(
    `SELECT COUNT(*) AS total FROM products p ${whereClause}`,
    countParams
  );
  const total = parseInt(countResult.rows[0].total, 10);

  params.push(parsedLimit);
  const limitParam = params.length;
  params.push(offset);
  const offsetParam = params.length;

  const result = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     ${whereClause}
     ORDER BY ${sortClause}
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    params
  );

  return {
    data: result.rows,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}

async function getProductById(productId) {
  const result = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [productId]
  );
  if (result.rows.length === 0) return null;
  const product = result.rows[0];

  const imagesResult = await db.query(
    `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC`,
    [productId]
  );
  product.images = imagesResult.rows;

  const skusResult = await db.query(
    `SELECT * FROM skus WHERE product_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`,
    [productId]
  );
  product.skus = skusResult.rows;

  return product;
}

async function createProduct(data) {
  const { name, description, base_price, category_id, brand_id, status, metadata } = data;
  const result = await db.query(
    `INSERT INTO products (name, description, base_price, category_id, brand_id, status, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, description || null, base_price, category_id || null, brand_id || null, status || 'draft', metadata || null]
  );
  return result.rows[0];
}

async function updateProduct(productId, data) {
  const existing = await db.query(
    `SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL`,
    [productId]
  );
  if (existing.rows.length === 0) return null;

  const { name, description, base_price, category_id, brand_id, status, metadata } = data;
  const result = await db.query(
    `UPDATE products
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         base_price = COALESCE($3, base_price),
         category_id = COALESCE($4, category_id),
         brand_id = COALESCE($5, brand_id),
         status = COALESCE($6, status),
         metadata = COALESCE($7, metadata),
         updated_at = NOW()
     WHERE id = $8 AND deleted_at IS NULL
     RETURNING *`,
    [name, description, base_price, category_id, brand_id, status, metadata, productId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function deleteProduct(productId) {
  const result = await db.query(
    `UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [productId]
  );
  return result.rows.length > 0;
}

// ─── SKUs ─────────────────────────────────────────────────────────────────────

async function listSkus(productId) {
  const result = await db.query(
    `SELECT * FROM skus WHERE product_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`,
    [productId]
  );
  return result.rows;
}

async function getSkuById(productId, skuId) {
  const result = await db.query(
    `SELECT * FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL`,
    [skuId, productId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function createSku(productId, data) {
  const { sku_code, attributes, price, stock_quantity, image_url } = data;
  const result = await db.query(
    `INSERT INTO skus (product_id, sku_code, attributes, price, stock_quantity, image_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [productId, sku_code, attributes || null, price, stock_quantity !== undefined ? stock_quantity : 0, image_url || null]
  );
  return result.rows[0];
}

async function updateSku(productId, skuId, data) {
  const existing = await db.query(
    `SELECT id FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL`,
    [skuId, productId]
  );
  if (existing.rows.length === 0) return null;

  const { sku_code, attributes, price, stock_quantity, image_url } = data;
  const result = await db.query(
    `UPDATE skus
     SET sku_code = COALESCE($1, sku_code),
         attributes = COALESCE($2, attributes),
         price = COALESCE($3, price),
         stock_quantity = COALESCE($4, stock_quantity),
         image_url = COALESCE($5, image_url),
         updated_at = NOW()
     WHERE id = $6 AND product_id = $7 AND deleted_at IS NULL
     RETURNING *`,
    [sku_code, attributes, price, stock_quantity, image_url, skuId, productId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function deleteSku(productId, skuId) {
  const result = await db.query(
    `UPDATE skus SET deleted_at = NOW() WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL RETURNING id`,
    [skuId, productId]
  );
  return result.rows.length > 0;
}

async function getStockForProduct(productId) {
  const result = await db.query(
    `SELECT SUM(stock_quantity) AS total_stock FROM skus WHERE product_id = $1 AND deleted_at IS NULL`,
    [productId]
  );
  return parseInt(result.rows[0].total_stock, 10) || 0;
}

// ─── Images ───────────────────────────────────────────────────────────────────

async function listImages(productId) {
  const result = await db.query(
    `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC`,
    [productId]
  );
  return result.rows;
}

async function addImage(productId, data) {
  const { url, alt_text, sort_order } = data;
  const result = await db.query(
    `INSERT INTO product_images (product_id, url, alt_text, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [productId, url, alt_text || null, sort_order !== undefined ? sort_order : 0]
  );
  return result.rows[0];
}

async function deleteImage(productId, imageId) {
  const result = await db.query(
    `DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING id`,
    [imageId, productId]
  );
  return result.rows.length > 0;
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function listCategories() {
  const result = await db.query(
    `SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC`
  );
  return result.rows;
}

async function getCategoryById(categoryId) {
  const result = await db.query(
    `SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL`,
    [categoryId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function createCategory(data) {
  const { name, description, parent_id, image_url } = data;
  const result = await db.query(
    `INSERT INTO categories (name, description, parent_id, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, parent_id || null, image_url || null]
  );
  return result.rows[0];
}

async function updateCategory(categoryId, data) {
  const existing = await db.query(
    `SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL`,
    [categoryId]
  );
  if (existing.rows.length === 0) return null;

  const { name, description, parent_id, image_url } = data;
  const result = await db.query(
    `UPDATE categories
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         parent_id = COALESCE($3, parent_id),
         image_url = COALESCE($4, image_url),
         updated_at = NOW()
     WHERE id = $5 AND deleted_at IS NULL
     RETURNING *`,
    [name, description, parent_id, image_url, categoryId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function deleteCategory(categoryId) {
  const result = await db.query(
    `UPDATE categories SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [categoryId]
  );
  return result.rows.length > 0;
}

async function listProductsByCategory(categoryId, filters = {}) {
  const category = await getCategoryById(categoryId);
  if (!category) return null;
  return listProducts({ ...filters, categoryId });
}

// ─── Brands ───────────────────────────────────────────────────────────────────

async function listBrands() {
  const result = await db.query(
    `SELECT * FROM brands WHERE deleted_at IS NULL ORDER BY name ASC`
  );
  return result.rows;
}

async function getBrandById(brandId) {
  const result = await db.query(
    `SELECT * FROM brands WHERE id = $1 AND deleted_at IS NULL`,
    [brandId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function createBrand(data) {
  const { name, description, image_url, website_url } = data;
  const result = await db.query(
    `INSERT INTO brands (name, description, image_url, website_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, image_url || null, website_url || null]
  );
  return result.rows[0];
}

async function updateBrand(brandId, data) {
  const existing = await db.query(
    `SELECT id FROM brands WHERE id = $1 AND deleted_at IS NULL`,
    [brandId]
  );
  if (existing.rows.length === 0) return null;

  const { name, description, image_url, website_url } = data;
  const result = await db.query(
    `UPDATE brands
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         image_url = COALESCE($3, image_url),
         website_url = COALESCE($4, website_url),
         updated_at = NOW()
     WHERE id = $5 AND deleted_at IS NULL
     RETURNING *`,
    [name, description, image_url, website_url, brandId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

async function deleteBrand(brandId) {
  const result = await db.query(
    `UPDATE brands SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [brandId]
  );
  return result.rows.length > 0;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  listSkus,
  getSkuById,
  createSku,
  updateSku,
  deleteSku,
  getStockForProduct,
  listImages,
  addImage,
  deleteImage,
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  listProductsByCategory,
  listBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
