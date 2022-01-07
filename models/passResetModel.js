const mongoose = require('mongoose')

const Reset = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  }
}, {timestamps: true})

Reset.index({ 'updatedAt': 1 }, { expireAfterSeconds: 900 })

const PasswordReset = mongoose.model('PasswordReset', Reset)

module.exports = PasswordReset