exports.up = function (knex) {
  return knex.schema.createTable('skus', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('sku_code', 100).notNullable().unique();
    table.string('size', 50).nullable();
    table.string('colour', 50).nullable();
    table.integer('stock').notNullable().defaultTo(0);
    table.integer('reserved_stock').notNullable().defaultTo(0);
    table.decimal('additional_price', 12, 2).notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('skus');
};
