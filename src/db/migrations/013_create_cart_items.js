exports.up = function (knex) {
  return knex.schema.createTable('cart_items', (table) => {
    table.increments('id').primary();
    table
      .integer('cart_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('carts')
      .onDelete('CASCADE');
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('CASCADE');
    table.integer('quantity').notNullable().defaultTo(1);
    table.unique(['cart_id', 'sku_id']);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('cart_items');
};
