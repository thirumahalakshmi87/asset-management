const express = require('express');

const router = express.Router();

const employee = require('../controllers/employee.controller');

const { isAuthenticated } = require('../middleware/auth');

router.get('/employees',isAuthenticated,employee.getAll);

router.get('/employees/add',isAuthenticated,employee.addForm);

router.post('/employees',isAuthenticated,employee.add);

router.get('/employees/:id/edit',isAuthenticated,employee.editForm);

router.get('/employees/:id',isAuthenticated,employee.details);

router.post('/employees/:id',isAuthenticated,employee.update);

router.post('/employees/:id/delete',isAuthenticated,employee.delete);

module.exports = router;