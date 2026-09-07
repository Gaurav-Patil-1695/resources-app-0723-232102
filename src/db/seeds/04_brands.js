/**
 * Sample brands
 */
exports.seed = async function (knex) {
  await knex('brands').del();

  await knex('brands').insert([
    {
      id: 1,
      name: 'TechCore',
      slug: 'techcore',
      description: 'Leading manufacturer of consumer electronics',
      website_url: 'https://techcore.example.com',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      name: 'UrbanWear',
      slug: 'urbanwear',
      description: 'Contemporary urban fashion brand',
      website_url: 'https://urbanwear.example.com',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 3,
      name: 'HomeFirst',
      slug: 'homefirst',
      description: 'Quality home goods and appliances',
      website_url: 'https://homefirst.example.com',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 4,
      name: 'PeakSport',
      slug: 'peaksport',
      description: 'High-performance sports and outdoor gear',
      website_url: 'https://peaksport.example.com',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 5,
      name: 'SoundWave',
      slug: 'soundwave',
      description: 'Premium audio equipment and accessories',
      website_url: 'https://soundwave.example.com',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 6,
      name: 'NovaLens',
      slug: 'novalens',
      description: 'Professional cameras and imaging solutions',
      website_url: 'https://novalens.example.com',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
