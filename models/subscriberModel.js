const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const {Audition} = require("../models/auditionModel")

const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a Name'],
        lowercase: true
    },
    location: {
        type: String,
        lowercase: true
    },
    phone_number: {
        type: String,
        required: [true, "Please enter phone number"],
    }
}, {timestamps: true})




const subscriber = mongoose.model('subscriber', subscriberSchema);
module.exports = subscriber;