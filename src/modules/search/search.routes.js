const express = require('express');
const router = express.Router();
const searchController = require('./search.controller');
const { validateSearchQuery, validateSuggestQuery } = require('./search.validator');

router.get('/', validateSearchQuery, searchController.search);
router.get('/suggest', validateSuggestQuery, searchController.suggest);

module.exports = router;
