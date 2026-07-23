/**
 * @typedef {Object} ProductImage
 * @property {string} id - Unique image identifier
 * @property {string} product_id - Associated product identifier
 * @property {string} url - Image URL
 * @property {string|null} alt_text - Accessibility alt text
 * @property {number} sort_order - Display order index
 * @property {boolean} is_primary - Whether this is the primary image
 */

/**
 * @typedef {Object} SKU
 * @property {string} id - Unique SKU identifier
 * @property {string} product_id - Associated product identifier
 * @property {string} sku_code - SKU code string
 * @property {number} price - Price in smallest currency unit (paise)
 * @property {number} compare_at_price - Original/compare price
 * @property {number} stock_quantity - Available stock
 * @property {boolean} is_available - Whether SKU is available for purchase
 * @property {Record<string, string>} attributes - Variant attributes (e.g. size, color)
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

/**
 * @typedef {Object} Brand
 * @property {string} id - Unique brand identifier
 * @property {string} name - Brand name
 * @property {string|null} logo_url - Brand logo URL
 * @property {string|null} description - Brand description
 * @property {boolean} is_active - Whether brand is active
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name
 * @property {string} slug - URL-friendly slug
 * @property {string|null} parent_id - Parent category identifier (null for root)
 * @property {string|null} image_url - Category image URL
 * @property {number} sort_order - Display order index
 * @property {boolean} is_active - Whether category is active
 * @property {Category[]} [children] - Nested subcategories
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} slug - URL-friendly slug
 * @property {string|null} description - Product description
 * @property {string} category_id - Associated category identifier
 * @property {Category} [category] - Populated category object
 * @property {string} brand_id - Associated brand identifier
 * @property {Brand} [brand] - Populated brand object
 * @property {SKU[]} skus - Available SKUs
 * @property {ProductImage[]} images - Product images
 * @property {number} average_rating - Average customer rating
 * @property {number} review_count - Total number of reviews
 * @property {boolean} is_active - Whether product is active
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

export default {};
