const express = require('express');
const router = express.Router();
const assetTransaction = require('../controllers/assetTransaction.controller');
const { isAuthenticated } = require('../middleware/auth');


router.get('/assets/issue',isAuthenticated,assetTransaction.issueForm);
router.post('/assets/issue',isAuthenticated,assetTransaction.issueAsset);
router.get('/assets/return',isAuthenticated,assetTransaction.returnForm);
router.post('/assets/return',isAuthenticated,assetTransaction.returnAsset);
router.get('/assets/scrap',isAuthenticated,assetTransaction.scrapForm);
router.post('/assets/scrap',isAuthenticated,assetTransaction.scrapAsset);
router.get('/assets/:id/history',isAuthenticated,assetTransaction.history);
router.get('/asset-transactions',isAuthenticated,assetTransaction.transactions);

module.exports = router;