const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true   // one download record per user
    },
    atsDownloaded: { type: Boolean, default: false },
    appDownloaded: { type: Boolean, default: false }
},
{ timestamps: true });

module.exports = mongoose.model('Download', downloadSchema);