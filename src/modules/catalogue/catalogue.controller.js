const catalogueService = require('./catalogue.service');

// ─── Products ────────────────────────────────────────────────────────────────

async function listProducts(req, res, next) {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      brandId: req.query.brandId,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await catalogueService.listProducts(filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await catalogueService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await catalogueService.getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await catalogueService.updateProduct(req.params.productId, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deleted = await catalogueService.deleteProduct(req.params.productId);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── SKUs ─────────────────────────────────────────────────────────────────────

async function listSkus(req, res, next) {
  try {
    const skus = await catalogueService.listSkus(req.params.productId);
    return res.status(200).json(skus);
  } catch (err) {
    next(err);
  }
}

async function createSku(req, res, next) {
  try {
    const sku = await catalogueService.createSku(req.params.productId, req.body);
    return res.status(201).json(sku);
  } catch (err) {
    next(err);
  }
}

async function getSku(req, res, next) {
  try {
    const sku = await catalogueService.getSkuById(req.params.productId, req.params.skuId);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found.' });
    }
    return res.status(200).json(sku);
  } catch (err) {
    next(err);
  }
}

async function updateSku(req, res, next) {
  try {
    const sku = await catalogueService.updateSku(req.params.productId, req.params.skuId, req.body);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found.' });
    }
    return res.status(200).json(sku);
  } catch (err) {
    next(err);
  }
}

async function deleteSku(req, res, next) {
  try {
    const deleted = await catalogueService.deleteSku(req.params.productId, req.params.skuId);
    if (!deleted) {
      return res.status(404).json({ message: 'SKU not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Images ───────────────────────────────────────────────────────────────────

async function listImages(req, res, next) {
  try {
    const images = await catalogueService.listImages(req.params.productId);
    return res.status(200).json(images);
  } catch (err) {
    next(err);
  }
}

async function addImage(req, res, next) {
  try {
    const image = await catalogueService.addImage(req.params.productId, req.body);
    return res.status(201).json(image);
  } catch (err) {
    next(err);
  }
}

async function deleteImage(req, res, next) {
  try {
    const deleted = await catalogueService.deleteImage(req.params.productId, req.params.imageId);
    if (!deleted) {
      return res.status(404).json({ message: 'Image not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function listCategories(req, res, next) {
  try {
    const categories = await catalogueService.listCategories();
    return res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await catalogueService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await catalogueService.getCategoryById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await catalogueService.updateCategory(req.params.categoryId, req.body);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const deleted = await catalogueService.deleteCategory(req.params.categoryId);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function listProductsByCategory(req, res, next) {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await catalogueService.listProductsByCategory(req.params.categoryId, filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── Brands ───────────────────────────────────────────────────────────────────

async function listBrands(req, res, next) {
  try {
    const brands = await catalogueService.listBrands();
    return res.status(200).json(brands);
  } catch (err) {
    next(err);
  }
}

async function createBrand(req, res, next) {
  try {
    const brand = await catalogueService.createBrand(req.body);
    return res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
}

async function getBrand(req, res, next) {
  try {
    const brand = await catalogueService.getBrandById(req.params.brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    return res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
}

async function updateBrand(req, res, next) {
  try {
    const brand = await catalogueService.updateBrand(req.params.brandId, req.body);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    return res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
}

async function deleteBrand(req, res, next) {
  try {
    const deleted = await catalogueService.deleteBrand(req.params.brandId);
    if (!deleted) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  listSkus,
  createSku,
  getSku,
  updateSku,
  deleteSku,
  listImages,
  addImage,
  deleteImage,
  listCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  listProductsByCategory,
  listBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
