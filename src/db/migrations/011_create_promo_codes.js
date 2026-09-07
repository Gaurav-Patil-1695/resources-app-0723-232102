exports.up = function (knex) {
  return knex.schema.createTable('promo_codes', (table) => {
    table.increments('id').primary();
    table.string('code', 50).notNullable().unique();
    table.text('description').nullable();
    table
      .enu('discount_type', ['percentage', 'flat'])
      .notNullable();
    table.decimal('discount_value', 12, 2).notNullable();
    table.decimal('min_order_value', 12, 2).nullable();
    table.decimal('max_discount_amount', 12, 2).nullable();
    table.integer('usage_limit').nullable();
    table.integer('usage_count').notNullable().defaultTo(0);
    table.integer('per_user_limit').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('starts_at').nullable();
    table.timestamp('expires_at').nullable();
    table.jsonb('rules').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('promo_codes');
};
