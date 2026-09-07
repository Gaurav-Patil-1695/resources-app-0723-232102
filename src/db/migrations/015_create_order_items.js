exports.up = function (knex) {
  return knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('RESTRICT');
    table.string('product_name', 300).notNullable();
    table.string('sku_code', 100).notNullable();
    table.string('size', 50).nullable();
    table.string('colour', 50).nullable();
    table.integer('quantity').notNullable();
    table.decimal('unit_price', 12, 2).notNullable();
    table.decimal('tax_rate', 5, 2).notNullable().defaultTo(0);
    table.decimal('tax_amount', 12, 2).notNullable().defaultTo(0);
    table.decimal('discount_amount', 12, 2).notNullable().defaultTo(0);
    table.decimal('total_price', 12, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('order_items');
};
