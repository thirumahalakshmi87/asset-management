const { Op } = require('sequelize');
const Asset = require('../models/asset');
const Branch = require('../models/branch');
exports.dashboard = async (req, res) => {
    try {
        // Total assets excluding scrapped
        const totalAssets = await Asset.count({
            where: {
                asset_status: {
                    [Op.ne]: 'SCRAPPED'
                }
            }
        });
        // Available assets
        const availableAssets = await Asset.count({
            where: {
                asset_status: 'AVAILABLE'
            }
        });
        // Issued assets
        const issuedAssets = await Asset.count({
            where: {
                asset_status: 'ISSUED'
            }
        });
        // Scrapped assets
        const scrappedAssets = await Asset.count({
            where: {
                asset_status: 'SCRAPPED'
            }
        });
        // All assets for value calculation
        const assets = await Asset.findAll({
            attributes: [
                'asset_status',
                'purchase_price'
            ]
        });
        let totalValue = 0;
        let availableValue = 0;
        let issuedValue = 0;
        assets.forEach(asset => {
            const price =
                parseFloat(asset.purchase_price) || 0;
            // Do not include scrapped assets
            // in current asset value
            if (asset.asset_status !== 'SCRAPPED') {
                totalValue += price;
            }
            if (asset.asset_status === 'AVAILABLE') {
                availableValue += price;
            }
            if (asset.asset_status === 'ISSUED') {
                issuedValue += price;
            }
        });
        res.render('dashboard', {
            title: 'Dashboard',
            totalAssets,
            availableAssets,
            issuedAssets,
            scrappedAssets,
            totalValue,
            availableValue,
            issuedValue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error loading Dashboard'
        );
    }
};