const { Op } = require('sequelize');
const AssetCategory = require('../models/assetCategory');

exports.getAll = async (req, res) => {
    try {
        const assetCategories = await AssetCategory.findAll({
            order: [['created_at', 'DESC']]
        });
        res.render('assetCategory/view', {
            title: 'AssetCategory Master',
            assetCategories
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading assetCategories');
    }
};

exports.addForm = (req, res) => {
    res.render('assetCategory/add', {
        title: 'Add AssetCategory'
    });
};

exports.add = async (req, res) => {
    try {
        const { category_code, category_name, description, is_active } = req.body;
        await AssetCategory.create({ category_code, category_name, description, is_active: is_active === 'true' });
        req.flash('success', 'AssetCategory added successfully');
        res.redirect('/assetCategories');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/assetCategories/add');
    }
};

exports.details = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.findByPk(req.params.id);
        if (!assetCategory) {
            return res.status(404).send('AssetCategory not found');
        }
        res.render('assetCategory/details', {
            title: 'AssetCategory Details',
            assetCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading assetCategory');
    }
};

exports.editForm = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.findByPk(req.params.id);
        if (!assetCategory) {
            return res.status(404).send('AssetCategory not found');
        }
        res.render('assetCategory/edit', {
            title: 'Edit AssetCategory',
            assetCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading assetCategory');
    }
};

exports.update = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.findByPk(req.params.id);
        if (!assetCategory) {
            return res.status(404).send('AssetCategory not found');
        }
        const { category_name, description, is_active } = req.body;
        await assetCategory.update({ category_name, description, is_active: is_active === 'true' });
        req.flash('success', 'AssetCategory updated successfully');
        res.redirect('/assetCategories');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect(`/assetCategories/${req.params.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.findByPk(req.params.id);
        if (!assetCategory) {
            return res.status(404).send('AssetCategory not found');
        }
        await assetCategory.destroy();
        req.flash('success', 'AssetCategory deleted successfully');
        res.redirect('/assetCategories');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to delete assetCategory');
        res.redirect('/assetCategories');
    }
};