const express = require('express');

const router = express.Router();

const branch = require('../controllers/branch.controller');

const { isAuthenticated } = require('../middleware/auth');

router.get('/branches',isAuthenticated,branch.getAll);

router.get('/branches/add',isAuthenticated,branch.addForm);

router.post('/branches',isAuthenticated,branch.add);

router.get('/branches/:id/edit',isAuthenticated,branch.editForm);

router.get('/branches/:id',isAuthenticated,branch.details);

router.post('/branches/:id',isAuthenticated,branch.update);

router.post('/branches/:id/delete',isAuthenticated,branch.delete);

module.exports = router;