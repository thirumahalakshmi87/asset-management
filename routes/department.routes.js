const express = require('express');

const router = express.Router();

const department = require('../controllers/department.controller');

const { isAuthenticated } = require('../middleware/auth');

router.get('/departments',isAuthenticated,department.getAll);

router.get('/departments/add',isAuthenticated,department.addForm);

router.post('/departments',isAuthenticated,department.add);

router.get('/departments/:id/edit',isAuthenticated,department.editForm);

router.get('/departments/:id',isAuthenticated,department.details);

router.post('/departments/:id',isAuthenticated,department.update);

router.post('/departments/:id/delete',isAuthenticated,department.delete);

module.exports = router;