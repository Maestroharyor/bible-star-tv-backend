const mongoose = require('mongoose');
const User = require('../models/userModel')

const fundsSchema =  new mongoose.Schema({
    details: {
        type: String,
        required: [true, "Funds details not added"]
    },
    amount: {
        type: Number,
        required: [true, "Amount not added"]
    },
    type:{
        type: String,
        enum: ["addition", "subtraction"]
    },
    category: {
        type: String,
        enum: ["audition", "voting", "homeplay"]
    },
    created_by: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        firstname: String,
        lastname: String,
        email: String
    }

}, {timestamps: true})

const Fund = mongoose.model('Fund', fundsSchema);
module.exports = Fund