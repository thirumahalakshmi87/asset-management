const { Op } = require('sequelize');
const Asset = require('../models/asset');
const Employee = require('../models/employee');
const AssetTransaction = require('../models/assetTransaction');
const ReturnReason = require('../models/returnReason');
const AssetScrap = require('../models/assetScrap');

exports.issueForm = async (req, res) => {
    try {
        const assets = await Asset.findAll({
            where: {
                asset_status: 'AVAILABLE'
            },
            order: [
                ['asset_name', 'ASC']
            ]
        });
        const employees = await Employee.findAll({
            where: {
                status: true
            },
            order: [
                ['first_name', 'ASC']
            ]
        });
        res.render('assetTransaction/issue', {
            title: 'Issue Asset',
            assets,
            employees
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error loading Issue Asset'
        );
    }
};

exports.issueAsset = async (req, res) => {
    try {
        const { asset_id, employee_id, issue_date, expected_return_date, remarks } = req.body;
        const asset = await Asset.findByPk(asset_id);
        if (!asset) {
            req.flash('error','Asset not found');
            return res.redirect('/assets/issue');
        }
        if (asset.asset_status !== 'AVAILABLE') {
            req.flash('error','Asset is not available');
            return res.redirect('/assets/issue');
        }
        await AssetTransaction.create({ asset_id,employee_id,issue_date,expected_return_date,transaction_status: 'ISSUED',remarks});
        await asset.update({
            asset_status: 'ISSUED'
        });
        req.flash('success','Asset issued successfully');
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        req.flash('error',error.message);
        res.redirect('/assets/issue');
    }
};

exports.returnForm = async (req, res) => {
    try {
        const transactions =
            await AssetTransaction.findAll({
                where: {
                    transaction_status: 'ISSUED'
                },
                order: [
                    ['issue_date', 'DESC']
                ]
            });
        const reasons =
            await ReturnReason.findAll({
                order: [
                    ['reason_name', 'ASC']
                ]
            });
        res.render('assetTransaction/return', {
            title: 'Return Asset',
            transactions,
            reasons
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error loading Return Asset'
        );
    }
};

exports.returnAsset = async (req, res) => {
    try {
        const { transaction_id, return_date, reason_id, remarks } = req.body;
        const transaction = await AssetTransaction.findByPk(transaction_id);
        if (!transaction) {
            req.flash('error','Transaction not found');
            return res.redirect('/assets/return');
        }
        if (transaction.transaction_status !== 'ISSUED') {
            req.flash('error','Asset is already returned');
            return res.redirect('/assets/return');
        }
        await transaction.update({return_date,reason_id,transaction_status: 'RETURNED',remarks});
        await Asset.update(
            {
                asset_status: 'AVAILABLE'
            },
            {
                where: {
                    asset_id: transaction.asset_id
                }
            }
        );
        req.flash('success','Asset returned successfully');
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/assets/return');
    }
};

exports.scrapForm = async (req, res) => {
    try {
        const assets = await Asset.findAll({
            where: {
                asset_status: {
                    [Op.ne]: 'SCRAPPED'
                }
            },
            order: [
                ['asset_name', 'ASC']
            ]
        });
        res.render('assetTransaction/scrap', {
            title: 'Scrap Asset',
            assets
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading Scrap Asset');
    }
};

exports.scrapAsset = async (req, res) => {
    try {
        const {asset_id,scrap_date,scrap_reason,scrap_value,remarks } = req.body;
        const asset =
            await Asset.findByPk(asset_id);
        if (!asset) {
            req.flash('error','Asset not found');
            return res.redirect('/assets/scrap');
        }
        if (asset.asset_status === 'SCRAPPED') {
            req.flash('error','Asset is already scrapped');
            return res.redirect('/assets/scrap');
        }
        if (asset.asset_status === 'ISSUED') {
            req.flash('error','Issued asset cannot be scrapped. Return the asset first.');
            return res.redirect('/assets/scrap');
        }
        await AssetScrap.create({asset_id,scrap_date,scrap_reason,scrap_value: scrap_value || null,remarks});
        await asset.update({
            asset_status: 'SCRAPPED'
        });
        req.flash('success','Asset scrapped successfully');
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        req.flash('error', error.message);
        res.redirect('/assets/scrap');
    }
};

exports.history = async (req, res) => {
    try {
        const asset =
            await Asset.findByPk(
                req.params.id
            );
        if (!asset) 
		{
            return res.status(404).send('Asset not found');
		}
        const transactions =
            await AssetTransaction.findAll({
                where: {
                    asset_id: req.params.id
                },
                order: [
                    ['created_at', 'ASC']
                ]
            });
        const scrap =
            await AssetScrap.findOne({
                where: {
                    asset_id: req.params.id
                }
            });
        res.render('assetTransaction/history', {
            title: 'Asset History',
            asset,
            transactions,
            scrap
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading Asset History');
    }
};

exports.transactions = async (req, res) => {
    try {
        const transactions = await AssetTransaction.findAll({
            order: [
                ['created_at', 'DESC']
            ]
        });
        const assets = await Asset.findAll();
        const employees = await Employee.findAll();
        const reasons = await ReturnReason.findAll();
        const transactionList = transactions.map(transaction => {
            const asset = assets.find(
                item => item.asset_id === transaction.asset_id
            );
            const employee = employees.find(
                item => item.employee_id === transaction.employee_id
            );
            const reason = reasons.find(
                item => item.reason_id === transaction.reason_id
            );
            return {
                ...transaction.toJSON(),
                asset_code:
                    asset ? asset.asset_code : '-',
                asset_name:
                    asset ? asset.asset_name : '-',
                employee_code:
                    employee ? employee.employee_code : '-',
                employee_name:
                    employee
                        ? `${employee.first_name} ${employee.last_name || ''}`
                        : '-',
                reason_name:
                    reason ? reason.reason_name : '-'
            };
        });
        res.render('assetTransaction/view', {
            title: 'Asset Transactions',
            transactions: transactionList
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading Asset Transactions');
    }
};