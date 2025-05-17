const mongoose = require('mongoose');
const availableColors = [
  '#1abc9c', '#3498db', '#f39c12', '#9b59b6', '#e67e22',
  '#e74c3c', '#2ecc71', '#34495e', '#fd79a8', '#8e44ad'
];
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'support', 'client'], default: 'client' },
  name: { type: String },
  chatColor: {
  type: String,
  default: function () {
    if (this.role === 'admin') return '#e74c3c';    // կարմիր
    if (this.role === 'support') return '#2980b9';  // կապույտ
    return '#27ae60'; // client → կանաչ
  }
},
isOnline: { type: Boolean, default: false },
activationToken: { type: String },
isActive: { type: Boolean, default: false }, 
});

module.exports = mongoose.model('User', UserSchema);
