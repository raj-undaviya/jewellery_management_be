const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/muse_jewellery');
        console.log('Connected to MongoDB');

        const email = 'admin@muse.com';
        const password = 'admin';

        let admin = await Admin.findOne({ email });
        if (admin) {
            console.log('Admin account already exists:', email);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            admin = new Admin({
                name: 'System Admin',
                email: email,
                password: hashedPassword
            });
            await admin.save();
            console.log('Successfully created admin account:');
            console.log('Email:', email);
            console.log('Password:', password);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
