const { Op } = require('sequelize');
const Department = require('../models/department');

exports.getAll = async (req, res) => {
    try {
        const departments = await Department.findAll({
            order: [['created_at', 'DESC']]
        });
        res.render('department/view', {
            title: 'Department Master',
            departments
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading departments');
    }
};

exports.addForm = (req, res) => {
    res.render('department/add', {
        title: 'Add Department'
    });
};

exports.add = async (req, res) => {
    try {
        const { department_code, department_name, description, is_active } = req.body;
        await Department.create({ department_code, department_name, description, is_active: is_active === 'true' });
        req.flash('success', 'Department added successfully');
        res.redirect('/departments');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/departments/add');
    }
};

exports.details = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).send('Department not found');
        }
        res.render('department/details', {
            title: 'Department Details',
            department
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading department');
    }
};

exports.editForm = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).send('Department not found');
        }
        res.render('department/edit', {
            title: 'Edit Department',
            department
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading department');
    }
};

exports.update = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).send('Department not found');
        }
        const { department_name, description, is_active } = req.body;
        await department.update({ department_name, description, is_active: is_active === 'true' });
        req.flash('success', 'Department updated successfully');
        res.redirect('/departments');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect(`/departments/${req.params.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).send('Department not found');
        }
        await department.destroy();
        req.flash('success', 'Department deleted successfully');
        res.redirect('/departments');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to delete department');
        res.redirect('/departments');
    }
};