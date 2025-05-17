const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

mongoose.connect('mongodb://127.0.0.1:27017/leanflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  try {
    const existing = await User.findOne({ email: 'admin@example1.com' });
    if (existing) {
      console.log('❌ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const newUser = new User({
      email: 'admin@example1.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true,
      chatColor: '#000000',
    });

    await newUser.save();
    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
})();
