const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Announcement Title not set'],
    },
    body: {
        type: String,
        required: [true, 'Announcement Body not set'],
    },
    slug: {
        type: String,
        required: [true, "Slug not set"],
        unique: [true, "Slug already exist"],
        lowercase: true
    },
    created_by: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstname: String,
        lastname: String,
        email: String
    },
}, {timestamps: true})



const Message = mongoose.model('message', messageSchema);
module.exports = Message;