exports.up = function (knex) {
  return knex.schema.createTable('return_requests', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('RESTRICT');
    table
      .integer('order_item_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('order_items')
      .onDelete('SET NULL');
    table.string('reason', 500).notNullable();
    table.text('description').nullable();
    table
      .enu('status', [
        'requested',
        'approved',
        'rejected',
        'picked_up',
        'completed',
      ])
      .notNullable()
      .defaultTo('requested');
    table.integer('quantity').notNullable().defaultTo(1);
    table.jsonb('images').nullable();
    table.text('admin_notes').nullable();
    table.timestamp('resolved_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('return_requests');
};
