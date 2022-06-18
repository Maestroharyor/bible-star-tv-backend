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
    email: {
        type: String,
        required: [true, "Please enter an email"],
        lowercase: true,
        unique: [true, "Email already exists"],
        validate: [isEmail, "Please Enter a Valid Email"]
    }
}, {timestamps: true})




const subscriber = mongoose.model('subscriber', subscriberSchema);
module.exports = subscriber;