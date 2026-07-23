exports.up = function (knex) {
  return knex.schema.createTable('order_tracking', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('carrier', 100).nullable();
    table.string('tracking_number', 200).nullable();
    table.string('tracking_url', 500).nullable();
    table.string('current_status', 100).nullable();
    table.text('status_description').nullable();
    table.jsonb('tracking_events').nullable();
    table.timestamp('estimated_delivery_at').nullable();
    table.timestamp('delivered_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('order_tracking');
};
