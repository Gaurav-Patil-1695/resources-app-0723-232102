const db = require('../knex');

const PRODUCTS_TABLE = 'products';
const IMAGES_TABLE = 'product_images';

const findById = (id) =>
  db(PRODUCTS_TABLE).where({ id }).first();

const findBySlug = (slug) =>
  db(PRODUCTS_TABLE).where({ slug }).first();

const findWithImages = async (id) => {
  const product = await findById(id);
  if (!product) return null;
  const images = await db(IMAGES_TABLE).where({ product_id: id }).orderBy('sort_order');
  return { ...product, images };
};

const list = ({ limit = 20, offset = 0, category_id, brand_id, is_active, search } = {}) => {
  const query = db(PRODUCTS_TABLE).limit(limit).offset(offset).orderBy('created_at', 'desc');
  if (category_id !== undefined) query.where({ category_id });
  if (brand_id !== undefined) query.where({ brand_id });
  if (is_active !== undefined) query.where({ is_active });
  if (search) query.where((qb) => qb.whereILike('name', `%${search}%`).orWhereILike('description', `%${search}%`));
  return query;
};

const count = (filters = {}) =>
  db(PRODUCTS_TABLE).where(filters).count('id as total').first().then((row) => parseInt(row.total, 10));

const create = (data) =>
  db(PRODUCTS_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(PRODUCTS_TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(PRODUCTS_TABLE).where({ id }).del();

// Product Images
const addImage = (data) =>
  db(IMAGES_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const removeImage = (id) =>
  db(IMAGES_TABLE).where({ id }).del();

const listImages = (product_id) =>
  db(IMAGES_TABLE).where({ product_id }).orderBy('sort_order');

const removeAllImages = (product_id) =>
  db(IMAGES_TABLE).where({ product_id }).del();

const reorderImages = (product_id, orderedIds) =>
  db.transaction(async (trx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await trx(IMAGES_TABLE)
        .where({ id: orderedIds[i], product_id })
        .update({ sort_order: i });
    }
  });

module.exports = {
  findById,
  findBySlug,
  findWithImages,
  list,
  count,
  create,
  update,
  remove,
  addImage,
  removeImage,
  listImages,
  removeAllImages,
  reorderImages,
};
