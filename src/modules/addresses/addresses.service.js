const db = require('../../config/db');
const createError = require('http-errors');

const getAddressesByUserId = async (userId) => {
  const result = await db.query(
    `SELECT * FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getAddressByIdAndUserId = async (addressId, userId) => {
  const result = await db.query(
    `SELECT * FROM addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [addressId, userId]
  );
  if (result.rows.length === 0) {
    throw createError(404, 'Address not found.');
  }
  return result.rows[0];
};

const checkPinCodeServiceability = async (pinCode) => {
  const result = await db.query(
    `SELECT 1 FROM serviceable_pin_codes WHERE pin_code = $1 AND is_active = true`,
    [pinCode]
  );
  return result.rows.length > 0;
};

const clearDefaultAddress = async (userId, client) => {
  await client.query(
    `UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL`,
    [userId]
  );
};

const createAddress = async (userId, payload) => {
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const serviceable = await checkPinCodeServiceability(pin_code);
  if (!serviceable) {
    throw createError(422, 'The provided PIN code is not serviceable.');
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const existingCount = await client.query(
      `SELECT COUNT(*) FROM addresses WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );
    const shouldBeDefault = is_default || parseInt(existingCount.rows[0].count, 10) === 0;

    if (shouldBeDefault) {
      await clearDefaultAddress(userId, client);
    }

    const result = await client.query(
      `INSERT INTO addresses
        (user_id, full_name, phone, address_line1, address_line2, city, state, pin_code, country, is_default, address_type, created_at, updated_at)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       RETURNING *`,
      [
        userId,
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        pin_code,
        country || 'India',
        shouldBeDefault,
        address_type || 'home',
      ]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateAddress = async (addressId, userId, payload) => {
  const existing = await getAddressByIdAndUserId(addressId, userId);

  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const newPinCode = pin_code !== undefined ? pin_code : existing.pin_code;
  if (pin_code && pin_code !== existing.pin_code) {
    const serviceable = await checkPinCodeServiceability(pin_code);
    if (!serviceable) {
      throw createError(422, 'The provided PIN code is not serviceable.');
    }
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const shouldBeDefault = is_default === true;
    if (shouldBeDefault && !existing.is_default) {
      await clearDefaultAddress(userId, client);
    }

    const result = await client.query(
      `UPDATE addresses SET
        full_name     = COALESCE($1, full_name),
        phone         = COALESCE($2, phone),
        address_line1 = COALESCE($3, address_line1),
        address_line2 = $4,
        city          = COALESCE($5, city),
        state         = COALESCE($6, state),
        pin_code      = COALESCE($7, pin_code),
        country       = COALESCE($8, country),
        is_default    = COALESCE($9, is_default),
        address_type  = COALESCE($10, address_type),
        updated_at    = NOW()
       WHERE id = $11 AND user_id = $12 AND deleted_at IS NULL
       RETURNING *`,
      [
        full_name || null,
        phone || null,
        address_line1 || null,
        address_line2 !== undefined ? address_line2 : existing.address_line2,
        city || null,
        state || null,
        newPinCode || null,
        country || null,
        is_default !== undefined ? is_default : null,
        address_type || null,
        addressId,
        userId,
      ]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteAddress = async (addressId, userId) => {
  const existing = await getAddressByIdAndUserId(addressId, userId);

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE addresses SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );

    if (existing.is_default) {
      const nextDefault = await client.query(
        `SELECT id FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );
      if (nextDefault.rows.length > 0) {
        await client.query(
          `UPDATE addresses SET is_default = true, updated_at = NOW() WHERE id = $1`,
          [nextDefault.rows[0].id]
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getAddressesByUserId,
  getAddressByIdAndUserId,
  createAddress,
  updateAddress,
  deleteAddress,
};
