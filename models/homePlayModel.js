const mongoose = require('mongoose');
const User = require('../models/userModel')

const HomePlaySchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question not set'],
        unique: [true, "Question already exists"],
        lowercase: true,
    },
    answers: {
        type: [String],
        required: [true, 'Answers not set'],
        lowercase: true
    },
    correct_answers: {
        type: [String],
        required: [true, 'Correct Answers not set'],
        lowercase: true,
    },
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true})



const HomePlay = mongoose.model('HomePlay', HomePlaySchema);
module.exports = HomePlay;