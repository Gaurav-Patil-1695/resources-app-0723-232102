const addressesService = require('./addresses.service');

const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await addressesService.getAddressesByUserId(userId);
    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const address = await addressesService.getAddressByIdAndUserId(addressId, userId);
    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const payload = req.body;
    const address = await addressesService.createAddress(userId, payload);
    return res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const payload = req.body;
    const address = await addressesService.updateAddress(addressId, userId, payload);
    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    await addressesService.deleteAddress(addressId, userId);
    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
