const { Op } = require('sequelize');
const Vendor = require('../models/vendor');

exports.getAll = async (req, res) => {
    try {
        const vendors = await Vendor.findAll({
            order: [['created_at', 'DESC']]
        });
        res.render('vendor/view', {
            title: 'Vendor Master',
            vendors
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading vendors');
    }
};

exports.addForm = (req, res) => {
    res.render('vendor/add', {
        title: 'Add Vendor'
    });
};

exports.add = async (req, res) => {
    try {
        const {            
            vendor_name,contact_person, mobile, email, address, created_at
        } = req.body;
        await Vendor.create({
            vendor_name,contact_person, mobile, email, address, created_at                     
        });
        req.flash('success', 'Vendor added successfully');
        res.redirect('/vendors');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/vendors/add');
    }
};

exports.details = async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) {
            return res.status(404).send('Vendor not found');
        }
        res.render('vendor/details', {
            title: 'Vendor Details',
            vendor
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading vendor');
    }
};

exports.editForm = async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) {
            return res.status(404).send('Vendor not found');
        }
        res.render('vendor/edit', {
            title: 'Edit Vendor',
            vendor
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading vendor');
    }
};

exports.update = async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) {
            return res.status(404).send('Vendor not found');
        }
        const {
            vendor_name,contact_person, mobile, email, address, created_at            
        } = req.body;
        await vendor.update({
            vendor_name,contact_person, mobile, email, address, created_at
        });
        req.flash('success', 'Vendor updated successfully');
        res.redirect('/vendors');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect(`/vendors/${req.params.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) {
            return res.status(404).send('Vendor not found');
        }
        await vendor.destroy();
        req.flash('success', 'Vendor deleted successfully');
        res.redirect('/vendors');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to delete vendor');
        res.redirect('/vendors');
    }
};