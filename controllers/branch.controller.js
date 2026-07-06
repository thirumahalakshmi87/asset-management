const { Op } = require('sequelize');
const Branch = require('../models/branch');

exports.getAll = async (req, res) => {
    try {
        const branches = await Branch.findAll({
            order: [['created_at', 'DESC']]
        });
        res.render('branch/view', {
            title: 'Branch Master',
            branches
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading branches');
    }
};

exports.addForm = (req, res) => {
    res.render('branch/add', {
        title: 'Add Branch'
    });
};

exports.add = async (req, res) => {
    try {
        const { branch_code, branch_name, address, city, state, country, is_active } = req.body;
        await Branch.create({ branch_code, branch_name, address, city, state, country, is_active: is_active === 'true' });
        req.flash('success', 'Branch added successfully');
        res.redirect('/branches');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/branches/add');
    }
};

exports.details = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).send('Branch not found');
        }
        res.render('branch/details', {
            title: 'Branch Details',
            branch
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading branch');
    }
};

exports.editForm = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).send('Branch not found');
        }
        res.render('branch/edit', {
            title: 'Edit Branch',
            branch
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading branch');
    }
};

exports.update = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).send('Branch not found');
        }
        const { branch_name, address, city, state, country, is_active } = req.body;
        await branch.update({ branch_name, address, city, state, country, is_active: is_active === 'true' });
        req.flash('success', 'Branch updated successfully');
        res.redirect('/branches');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect(`/branches/${req.params.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).send('Branch not found');
        }
        await branch.destroy();
        req.flash('success', 'Branch deleted successfully');
        res.redirect('/branches');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to delete branch');
        res.redirect('/branches');
    }
};