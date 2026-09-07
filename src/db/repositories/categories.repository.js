const db = require('../knex');

const TABLE = 'categories';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findBySlug = (slug) =>
  db(TABLE).where({ slug }).first();

const listRoots = () =>
  db(TABLE).whereNull('parent_id').orderBy('sort_order').orderBy('name');

const findChildren = (parent_id) =>
  db(TABLE).where({ parent_id }).orderBy('sort_order').orderBy('name');

const findAncestors = async (id) => {
  const ancestors = [];
  let current = await findById(id);
  while (current && current.parent_id) {
    current = await findById(current.parent_id);
    if (current) ancestors.unshift(current);
  }
  return ancestors;
};

const findDescendants = async (id) => {
  const descendants = [];
  const queue = await findChildren(id);
  while (queue.length) {
    const node = queue.shift();
    descendants.push(node);
    const children = await findChildren(node.id);
    children.forEach((c) => queue.push(c));
  }
  return descendants;
};

const getTree = async () => {
  const all = await db(TABLE).orderBy('sort_order').orderBy('name');
  const map = {};
  all.forEach((c) => { map[c.id] = { ...c, children: [] }; });
  const roots = [];
  all.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
};

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

const list = ({ limit = 50, offset = 0 } = {}) =>
  db(TABLE).orderBy('sort_order').orderBy('name').limit(limit).offset(offset);

module.exports = {
  findById,
  findBySlug,
  listRoots,
  findChildren,
  findAncestors,
  findDescendants,
  getTree,
  create,
  update,
  remove,
  list,
};
