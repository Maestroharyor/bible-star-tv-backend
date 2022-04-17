const mongoose = require('mongoose');
const User = require('../models/userModel')

const auditionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question not set'],
        unique: [true, "Question already exists"],
        lowercase: true,
    },
    book_of_bible: {
        type: String,
        required: [true, 'Book of the bible not set'],
        lowercase: true
        // unique: [true, "Book of the bible already exists"],
    },
    answers: {
        type: [String],
        required: [true, 'Answers not set'],
        lowercase: true
    },
    correct_answer: {
        type: String,
        required: [true, 'Correct Answer not set'],
        lowercase: true,
    },
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true})



const Audition = mongoose.model('Audition', auditionSchema);
module.exports = Audition;