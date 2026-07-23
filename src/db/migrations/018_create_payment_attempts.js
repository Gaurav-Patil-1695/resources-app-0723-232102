exports.up = function (knex) {
  return knex.schema.createTable('payment_attempts', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('gateway', 50).notNullable();
    table.string('gateway_order_id', 255).nullable();
    table.string('gateway_payment_id', 255).nullable();
    table.string('gateway_signature', 500).nullable();
    table
      .enu('status', ['initiated', 'success', 'failed', 'pending'])
      .notNullable()
      .defaultTo('initiated');
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('INR');
    table.jsonb('gateway_response').nullable();
    table.timestamp('attempted_at').notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('payment_attempts');
};
