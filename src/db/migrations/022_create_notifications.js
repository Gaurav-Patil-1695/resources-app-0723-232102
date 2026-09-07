exports.up = function (knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .comment('NULL indicates a broadcast notification');
    table.string('type', 100).notNullable();
    table.string('title', 300).notNullable();
    table.text('body').notNullable();
    table.jsonb('data').nullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('read_at').nullable();
    table
      .enu('channel', ['push', 'email', 'sms', 'in_app'])
      .notNullable()
      .defaultTo('in_app');
    table.timestamp('sent_at').nullable();
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['is_read']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
