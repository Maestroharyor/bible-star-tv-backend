const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/userModel')

//Create VoteSchema
const VoteSchema = new Schema(
  {
    heading: {
      type: String,
      required: [true, "Heading not added"],
    },
    details: {
      type: String,
      required: [true, "Excerpt not added"],
    },
    amount_deducted: {
      type: Number,
      required: [true, "Amount not added"],
    },
    voted_for: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstname: String,
        lastname: String,
        email: String
    },
    created_by: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstname: String,
        lastname: String,
        email: String
    },
  },
  { timestamps: true }
);

//Create Model
const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote