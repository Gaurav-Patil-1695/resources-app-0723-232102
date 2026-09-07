exports.up = function (knex) {
  return knex.schema.createTable('refunds', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('RESTRICT');
    table
      .integer('payment_attempt_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('payment_attempts')
      .onDelete('SET NULL');
    table.decimal('amount', 12, 2).notNullable();
    table.string('reason', 500).nullable();
    table
      .enu('status', ['pending', 'processed', 'failed'])
      .notNullable()
      .defaultTo('pending');
    table.string('gateway_refund_id', 255).nullable();
    table.jsonb('gateway_response').nullable();
    table.timestamp('processed_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('refunds');
};
