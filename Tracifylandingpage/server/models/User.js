const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    altWhatsapp: { type: String },
    email: { type: String, required: true, unique: true },
    aadhar: { type: String, required: true },
    address: { type: String, required: true },
    imei1: { type: String, required: true },
    imei2: { type: String, required: true },
    photoUrl: { type: String }, // Base64 or URL
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
