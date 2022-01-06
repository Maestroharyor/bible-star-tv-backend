const mongoose = require('mongoose');

const auditionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question not set'],
        lowercase: true,
    },
    answers: {
        type: [String],
        required: [true, 'Answers not set']
    },
    correct_answer: {
        type: String,
        required: [true, 'Correct Answer not set']
    },
}, {timestamps: true})



const Audition = mongoose.model('Audition', auditionSchema);
module.exports = Audition;