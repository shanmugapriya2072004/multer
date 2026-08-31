const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createDirectAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Atlas Connected');

    const adminEmail = 'admin@medivault.com';
    const adminPassword = 'adminpassword123';

    let admin = await User.findOne({
      email: adminEmail
    });

    // Existing admin
    if (admin) {
      console.log('ℹ️ Admin email already exists');

      admin.name = 'Super Admin';
      admin.role = 'admin';
      admin.phone = '9999999999';

      // User.js pre-save middleware will hash this
      admin.password = adminPassword;

      await admin.save();

      console.log('✅ Existing admin updated successfully');
    }

    // New admin
    else {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '9999999999'
      });

      console.log('🎉 New admin account created');
    }

    console.log('');
    console.log('====================================');
    console.log('       ADMIN LOGIN DETAILS');
    console.log('====================================');
    console.log('📧 Email    : admin@medivault.com');
    console.log('🔑 Password : adminpassword123');
    console.log('👤 Role     : admin');
    console.log('====================================');

    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);

    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

createDirectAdmin();