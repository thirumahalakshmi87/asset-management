const express = require('express');

const router = express.Router();

const assetCategory = require('../controllers/assetCategory.controller');

const { isAuthenticated } = require('../middleware/auth');

router.get('/assetCategories',isAuthenticated,assetCategory.getAll);

router.get('/assetCategories/add',isAuthenticated,assetCategory.addForm);

router.post('/assetCategories',isAuthenticated,assetCategory.add);

router.get('/assetCategories/:id/edit',isAuthenticated,assetCategory.editForm);

router.get('/assetCategories/:id',isAuthenticated,assetCategory.details);

router.post('/assetCategories/:id',isAuthenticated,assetCategory.update);

router.post('/assetCategories/:id/delete',isAuthenticated,assetCategory.delete);

module.exports = router;