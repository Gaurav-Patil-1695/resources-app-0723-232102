/**
 * Sample category tree
 */
exports.seed = async function (knex) {
  await knex('categories').del();

  // Root categories
  await knex('categories').insert([
    {
      id: 1,
      parent_id: null,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      parent_id: null,
      name: 'Clothing',
      slug: 'clothing',
      description: 'Apparel and fashion items',
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 3,
      parent_id: null,
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Products for home and garden',
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 4,
      parent_id: null,
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      is_active: true,
      sort_order: 4,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // Sub-categories: Electronics
  await knex('categories').insert([
    {
      id: 10,
      parent_id: 1,
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and smartphones',
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 11,
      parent_id: 1,
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and notebook computers',
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 12,
      parent_id: 1,
      name: 'Audio',
      slug: 'audio',
      description: 'Headphones, speakers, and audio equipment',
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 13,
      parent_id: 1,
      name: 'Cameras',
      slug: 'cameras',
      description: 'Digital cameras and photography equipment',
      is_active: true,
      sort_order: 4,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // Sub-categories: Clothing
  await knex('categories').insert([
    {
      id: 20,
      parent_id: 2,
      name: "Men's Clothing",
      slug: 'mens-clothing',
      description: "Clothing for men",
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 21,
      parent_id: 2,
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: "Clothing for women",
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 22,
      parent_id: 2,
      name: "Kids' Clothing",
      slug: 'kids-clothing',
      description: "Clothing for children",
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 23,
      parent_id: 2,
      name: 'Footwear',
      slug: 'footwear',
      description: 'Shoes, boots, and sandals',
      is_active: true,
      sort_order: 4,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // Sub-categories: Home & Garden
  await knex('categories').insert([
    {
      id: 30,
      parent_id: 3,
      name: 'Furniture',
      slug: 'furniture',
      description: 'Indoor and outdoor furniture',
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 31,
      parent_id: 3,
      name: 'Kitchen',
      slug: 'kitchen',
      description: 'Kitchen appliances and cookware',
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 32,
      parent_id: 3,
      name: 'Garden Tools',
      slug: 'garden-tools',
      description: 'Tools and equipment for gardening',
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // Sub-categories: Sports & Outdoors
  await knex('categories').insert([
    {
      id: 40,
      parent_id: 4,
      name: 'Fitness Equipment',
      slug: 'fitness-equipment',
      description: 'Gym and fitness equipment',
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 41,
      parent_id: 4,
      name: 'Camping & Hiking',
      slug: 'camping-hiking',
      description: 'Gear for camping and hiking',
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 42,
      parent_id: 4,
      name: 'Cycling',
      slug: 'cycling',
      description: 'Bikes and cycling accessories',
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
