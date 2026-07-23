exports.up = function (knex) {
  return knex.schema.createTable('stock_reservations', (table) => {
    table.increments('id').primary();
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('CASCADE');
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table
      .enu('status', ['reserved', 'confirmed', 'released'])
      .notNullable()
      .defaultTo('reserved');
    table.timestamp('expires_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('stock_reservations');
};
