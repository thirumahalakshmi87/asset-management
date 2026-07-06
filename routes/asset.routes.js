const express = require('express');

const router = express.Router();

const asset = require('../controllers/asset.controller');

const { isAuthenticated } = require('../middleware/auth');

router.get('/assets',isAuthenticated,asset.getAll);

router.get('/assets/add',isAuthenticated,asset.addForm);

router.post('/assets',isAuthenticated,asset.add);

router.get('/assets/stock',isAuthenticated,asset.stockView);

router.get('/assets/:id/edit',isAuthenticated,asset.editForm);

router.get('/assets/:id',isAuthenticated,asset.details);

router.post('/assets/:id',isAuthenticated,asset.update);

router.post('/assets/:id/delete',isAuthenticated,asset.delete);

module.exports = router;