const { Op } = require('sequelize');
const Employee = require('../models/employee');

exports.getAll = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            order: [['created_at', 'DESC']]
        });
        res.render('employee/view', {
            title: 'Employee Master',
            employees
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading employees');
    }
};

exports.addForm = (req, res) => {
    res.render('employee/add', {
        title: 'Add Employee'
    });
};

exports.add = async (req, res) => {
    try {
        const { employee_code, first_name, last_name, email, mobile, designation, status } = req.body;
        await Employee.create({ employee_code, first_name, last_name, email: email || null, mobile, designation, status: status === 'true' });
        req.flash('success', 'Employee added successfully');
        res.redirect('/employees');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/employees/add');
    }
};

exports.details = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.render('employee/details', {
            title: 'Employee Details',
            employee
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading employee');
    }
};

exports.editForm = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.render('employee/edit', {
            title: 'Edit Employee',
            employee
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading employee');
    }
};

exports.update = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        const { first_name, last_name, email, mobile, designation, status } = req.body;
        await employee.update({ first_name, last_name, email: email || null, mobile, designation, status: status === 'true' });
        req.flash('success', 'Employee updated successfully');
        res.redirect('/employees');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect(`/employees/${req.params.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        await employee.destroy();
        req.flash('success', 'Employee deleted successfully');
        res.redirect('/employees');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to delete employee');
        res.redirect('/employees');
    }
};