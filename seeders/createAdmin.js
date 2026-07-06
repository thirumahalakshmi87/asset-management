const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const Administrator = require('../models/administrator');

const createAdmin = async () => {
    try {
        await sequelize.authenticate();

        const existingAdmin = await Administrator.findOne({
            where: {
                username: 'admin'
            }
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await Administrator.create({
            username: 'admin',
            password: hashedPassword,
            full_name: 'Administrator',
            email: 'admin@example.com',
            is_active: true
        });

        console.log('Admin created successfully');
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();