const { Op } = require('sequelize');
const Asset = require('../models/asset');
const AssetCategory = require('../models/assetCategory');
const Vendor = require('../models/vendor');
const Branch = require('../models/branch');

exports.getAll = async (req, res) => {
    try {
        const assets = await Asset.findAll({
			 include: [
                {
                    model: AssetCategory,
                    as: 'category',
                    attributes: ['category_name']
                },
                {
                    model: Vendor,
                    as: 'vendor',
                    attributes: ['vendor_name']
                },
                {
                    model: Branch,
                    as: 'branch',
                    attributes: ['branch_name']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.render('asset/view', {
            title: 'Asset Master',
            assets
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading assets');
    }
};

exports.addForm = async (req, res) => {
	 const categories = await AssetCategory.findAll({
            where: {
                is_active: true
            },
            order: [['category_name', 'ASC']]
        });
        const vendors = await Vendor.findAll({
            order: [['vendor_name', 'ASC']]
        });
        const branches = await Branch.findAll({
            where: {
                is_active: true
            },
            order: [['branch_name', 'ASC']]
        });
    res.render('asset/add', {
        title: 'Add Asset',
            categories,
            vendors,
            branches	
    });
};

exports.add = async (req, res) => {
    try {
        const {            
            asset_id, asset_code, serial_number, asset_name, category_id, vendor_id, branch_id, make, model, purchase_date, purchase_price, warranty_expiry, asset_status, remarks
        } = req.body;
        await Asset.create({
            asset_id, asset_code, serial_number, asset_name, category_id, vendor_id, branch_id, make, model, purchase_date, purchase_price, warranty_expiry, asset_status, remarks                
        });
        req.flash('success', 'Asset added successfully');
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/assets/add');
    }
};

exports.details = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        res.render('asset/details', {
            title: 'Asset Details',
            asset
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading asset');
    }
};

exports.editForm = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
		 const categories = await AssetCategory.findAll({
            where: {
                is_active: true
            },
            order: [['category_name', 'ASC']]
        });
        const vendors = await Vendor.findAll({           
            order: [['vendor_name', 'ASC']]
        });
        const branches = await Branch.findAll({
            where: {
                is_active: true
            },
            order: [['branch_name', 'ASC']]
        });
        res.render('asset/edit', {
            title: 'Edit Asset',
            asset,
			categories,
            vendors,
            branches
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading asset');
    }
};

exports.update = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        const {
            asset_id, asset_code, serial_number, asset_name, category_id, vendor_id, branch_id, make, model, purchase_date, purchase_price, warranty_expiry, asset_status, remarks
        } = req.body;
        await asset.update({
           asset_id, asset_code, serial_number, asset_name, category_id, vendor_id, branch_id, make, model, purchase_date, purchase_price, warranty_expiry, asset_status, remarks
        });
        req.flash('success', 'Asset updated successfully');
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect(`/assets/${req.params.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        await asset.destroy();
        req.flash('success', 'Asset deleted successfully');
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to delete asset');
        res.redirect('/assets');
    }
};

exports.stockView = async (req, res) => {
    try {
        const assets = await Asset.findAll({
            include: [
                {
                    model: Branch,
                    as: 'branch',
                    attributes: [
                        'branch_id',
                        'branch_name'
                    ]
                },
                {
                    model: AssetCategory,
                    as: 'category',
                    attributes: [
                        'category_name'
                    ]
                },
                {
                    model: Vendor,
                    as: 'vendor',
                    attributes: [
                        'vendor_name'
                    ]
                }
            ],
            where: {
                asset_status: 'AVAILABLE'
            },
            order: [
                ['asset_name', 'ASC']
            ]
        });
        const branchSummary = {};
        assets.forEach(asset => {
            const branchId =
                asset.branch_id;
            const branchName =
                asset.branch
                    ? asset.branch.branch_name
                    : 'Unknown';
            if (!branchSummary[branchId]) {
                branchSummary[branchId] = {
                    branch_name: branchName,
                    total_assets: 0,
                    total_value: 0
                };
            }
            branchSummary[branchId].total_assets++;
            branchSummary[branchId].total_value +=
                parseFloat(asset.purchase_price) || 0;
        });
        const summary =
            Object.values(branchSummary);
        const totalAssets =
            assets.length;
        const totalValue =
            assets.reduce(
                (total, asset) =>
                    total +
                    (parseFloat(asset.purchase_price) || 0),
                0
            );
        res.render('asset/stock', {
            title: 'Stock View',
            assets,
            summary,
            totalAssets,
            totalValue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error loading Stock View'
        );
    }
};