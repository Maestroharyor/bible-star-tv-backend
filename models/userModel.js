const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const {Audition} = require("../models/auditionModel")

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please enter a Last Name'],
        lowercase: true
    },
    lastname: {
        type: String,
        required: [true, 'Please enter a First name'],
        lowercase: true
    },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, "Username already exists"],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        lowercase: true,
        unique: [true, "Email already exists"],
        validate: [isEmail, "Please Enter a Valid Email"]
    },
    gender: {
        type: String,
        required: [true, "Please enter an gender"],
        lowercase: true,
        enum: ["male", "female"]
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [6, "Minimum Password length is 6"]
    },
    user_role: {
        type: String,
        enum: ['subscriber', 'contestant', 'admin', 'superadmin'],
        required: [true, 'User Role not set']
    },
    batch: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        // required: [true, 'User Role not set']
    },
    location: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    date_of_birth: {
        type: Date,
    },
    gender: {
        enum: ['male', 'female'],
        type: String,
    },
    bio: {
        type: String,
    },
    my_stats: {
        total_points: {
            type: Number
        },
        total_attempts: {
            type: Number
        },
        wallet_balance: {
            type: Number
        },
        amount_spent: {
            type: Number
        },
        total_votes: {
            type: Number
        },
    },
    subscriber_stats: {
        wallet_balance: {
            type: Number
        },
        amount_spent: {
            type: Number
        },
        total_votes: {
            type: Number
        },
        contestants_voted_for: [
            {id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, username: String}
        ],
    },
    auditioned_questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Audition'}],
}, {timestamps: true})

//Fire a function before a user is saved to the database
// Hashing the password
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
next()
})

//Fire a function after a user has been saved to the database
//Function to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email")
}



const User = mongoose.model('User', userSchema);
module.exports = User;