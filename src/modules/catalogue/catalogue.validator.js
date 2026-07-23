const Joi = require('joi');

// ─── Reusable field definitions ───────────────────────────────────────────────

const uuidParam = Joi.string().uuid().required();

// ─── Param schemas ────────────────────────────────────────────────────────────

const productIdParamSchema = Joi.object({
  productId: uuidParam,
});

const skuIdParamSchema = Joi.object({
  productId: uuidParam,
  skuId: uuidParam,
});

const categoryIdParamSchema = Joi.object({
  categoryId: uuidParam,
});

const brandIdParamSchema = Joi.object({
  brandId: uuidParam,
});

const imageIdParamSchema = Joi.object({
  productId: uuidParam,
  imageId: uuidParam,
});

// ─── Product schemas ──────────────────────────────────────────────────────────

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Product name is required.',
    'any.required': 'Product name is required.',
    'string.max': 'Product name must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(5000).optional().allow('', null).messages({
    'string.max': 'Product description must not exceed 5000 characters.',
  }),
  base_price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Base price must be a number.',
    'number.positive': 'Base price must be greater than zero.',
    'any.required': 'Base price is required.',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Category ID must be a valid UUID.',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Brand ID must be a valid UUID.',
  }),
  status: Joi.string().valid('draft', 'active', 'archived').optional().default('draft').messages({
    'any.only': 'Status must be one of draft, active, or archived.',
  }),
  metadata: Joi.object().optional().allow(null),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Product name must not be empty.',
    'string.max': 'Product name must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(5000).optional().allow('', null).messages({
    'string.max': 'Product description must not exceed 5000 characters.',
  }),
  base_price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Base price must be a number.',
    'number.positive': 'Base price must be greater than zero.',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Category ID must be a valid UUID.',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Brand ID must be a valid UUID.',
  }),
  status: Joi.string().valid('draft', 'active', 'archived').optional().messages({
    'any.only': 'Status must be one of draft, active, or archived.',
  }),
  metadata: Joi.object().optional().allow(null),
});

// ─── SKU schemas ──────────────────────────────────────────────────────────────

const createSkuSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'SKU code is required.',
    'any.required': 'SKU code is required.',
    'string.max': 'SKU code must not exceed 100 characters.',
  }),
  attributes: Joi.object().optional().allow(null).messages({}),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'SKU price must be a number.',
    'number.positive': 'SKU price must be greater than zero.',
    'any.required': 'SKU price is required.',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Stock quantity must be a number.',
    'number.integer': 'Stock quantity must be an integer.',
    'number.min': 'Stock quantity must be zero or greater.',
  }),
  image_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

const updateSkuSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'SKU code must not be empty.',
    'string.max': 'SKU code must not exceed 100 characters.',
  }),
  attributes: Joi.object().optional().allow(null),
  price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'SKU price must be a number.',
    'number.positive': 'SKU price must be greater than zero.',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number.',
    'number.integer': 'Stock quantity must be an integer.',
    'number.min': 'Stock quantity must be zero or greater.',
  }),
  image_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

// ─── Category schemas ─────────────────────────────────────────────────────────

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Category name is required.',
    'any.required': 'Category name is required.',
    'string.max': 'Category name must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null).messages({
    'string.max': 'Category description must not exceed 2000 characters.',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Parent category ID must be a valid UUID.',
  }),
  image_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Category name must not be empty.',
    'string.max': 'Category name must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null).messages({
    'string.max': 'Category description must not exceed 2000 characters.',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Parent category ID must be a valid UUID.',
  }),
  image_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

// ─── Brand schemas ────────────────────────────────────────────────────────────

const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Brand name is required.',
    'any.required': 'Brand name is required.',
    'string.max': 'Brand name must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null).messages({
    'string.max': 'Brand description must not exceed 2000 characters.',
  }),
  image_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
  website_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Website URL must be a valid URL.',
  }),
});

const updateBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Brand name must not be empty.',
    'string.max': 'Brand name must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null).messages({
    'string.max': 'Brand description must not exceed 2000 characters.',
  }),
  image_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
  website_url: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': 'Website URL must be a valid URL.',
  }),
});

// ─── Middleware factories ─────────────────────────────────────────────────────

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Validation failed.', errors: messages });
    }
    req.body = value;
    next();
  };
}

function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Validation failed.', errors: messages });
    }
    req.params = value;
    next();
  };
}

module.exports = {
  validateBody,
  validateParams,
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  productIdParamSchema,
  skuIdParamSchema,
  categoryIdParamSchema,
  brandIdParamSchema,
  imageIdParamSchema,
};
