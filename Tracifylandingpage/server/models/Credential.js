const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
    // Credentials (created in step 2)
    userId: { type: String, required: true, unique:true },
    passwordHash: { type: String },
}, 
{ timestamps: true });

module.exports = mongoose.model('Credential', CredentialSchema);
