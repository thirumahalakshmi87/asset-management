const express = require('express');

const router = express.Router();

const vendor = require('../controllers/vendor.controller');

const { isAuthenticated } = require('../middleware/auth');

router.get('/vendors',isAuthenticated,vendor.getAll);

router.get('/vendors/add',isAuthenticated,vendor.addForm);

router.post('/vendors',isAuthenticated,vendor.add);

router.get('/vendors/:id/edit',isAuthenticated,vendor.editForm);

router.get('/vendors/:id',isAuthenticated,vendor.details);

router.post('/vendors/:id',isAuthenticated,vendor.update);

router.post('/vendors/:id/delete',isAuthenticated,vendor.delete);

module.exports = router;