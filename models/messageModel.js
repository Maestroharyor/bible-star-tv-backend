const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Message Title not set'],
    },
    body: {
        type: String,
        required: [true, 'Message Body not set'],
    },
    message_type: {
        type: String,
        enum: ["general", "individual"],
        required: [true, 'Message Type not set'],
    },
    message_recipient: {
        type: [{id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, username: String}]
    },

}, {timestamps: true})



const Message = mongoose.model('message', messageSchema);
module.exports = Message;