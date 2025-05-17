const mongoose = require('mongoose');
const User = require('../models/User');

// ✅ STEP 1: Connect to your database
mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME_HERE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // ✅ STEP 2: Set default role to 'client' where missing
    const roleResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'client' } }
    );
    console.log(`🔧 Roles updated: ${roleResult.modifiedCount}`);

    // ✅ STEP 3: Set default chatColor to '' where missing
    const colorResult = await User.updateMany(
      { chatColor: { $exists: false } },
      { $set: { chatColor: '' } }
    );
    console.log(`🔧 Chat colors updated: ${colorResult.modifiedCount}`);

    // ✅ STEP 4: Set default email to 'example@example.com' where missing
    const emailResult = await User.updateMany(
      { email: { $exists: false } },
      { $set: { email: 'example@example.com' } }
    );
    console.log(`🔧 Emails updated: ${emailResult.modifiedCount}`);

    console.log('🎉 All users updated successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
