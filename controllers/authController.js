const User = require('../models/userModel');
const PassReset = require('../models/passResetModel');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const {sendEmail} = require('../mail/main')
const moment = require('moment');


const maxAge = 3 * 24 * 60 * 60

const createToken = id =>{
    return jwt.sign({id}, 'braandly@maestroJoshAd21!!!', {
        expiresIn: maxAge
    })
}

const handleError = err => {
    console.log("Handle Error",err.message, err.code)
    // console.log(err.errors)
    let errors = {}

    if(err.message === "Incorrect Email"){
        errors.email = "Email is Not Registered"
    }

    if(err.message === "Incorrect Password"){
        errors.email = "The Password is Incorrect"
    }

    if(err.message.toLowerCase().includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=> {
            errors[properties.path] = properties.message
        })        

    } else if(err.code === 11000){
        errors.email ="Email already exists"
    }


    return errors
}


const auth_signup = (req, res) => {
    const {username, email, password} = req.body
    let plan, user_role;
    const current_date = moment().format('YYYY-MM-DD')
    // const expires_date = moment(current_date).add(1, 'y').format('YYYY-MM-DD')
    // console.log({current_date, expires_date})
    // `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
    if(!req.body.plan){
        plan = {
            name: "Hobby",
            pricing_model: "yearly",
            created: current_date
        }
    } else{
        plan = plan
    }
    user_role = req.body.user_role ? req.body.user_role : "subscriber";

    User.create({username, email, password, user_role, plan})
    .then(response => {
        const token = createToken(response._id)
        res.cookie('b_jt', token, {httpOnly: true, maxAge: maxAge})
        res.status(201).json({
            id: response._id,
            username: response.username,
            email: response.email,
            user_role: response.user_role,
            plan: {name: response.plan.name,
                pricing_model: response.plan.pricing_model,
                created: response.plan.created
            }})
        // res.status(201).json(response)
    })
    .catch(err=> {
        const errors = handleError(err)
        res.status(400).json({errors})
    })
}

const auth_login = (req, res) => {
    User.login(req.body.email, req.body.password)
    .then(response => {
        const token = createToken(response._id)
        res.cookie('b_jt', token, {httpOnly: true, maxAge: maxAge})
        res.status(201).json({
            id: response._id,
            username: response.username,
            email: response.email,
            user_role: response.user_role,
            plan_name: response.plan.name
        })
    })
    .catch(err =>{
        // console.log(err.message)
        const errors = handleError(err)
      res.status(400).json({errors})  
    })
    
}


const auth_password_reset = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({email})
    if(!user){
        res.status(400).json({errors: {email: "Email does not exist"}})
    }

    console.log(user)
    const token = v4().toString().replace(/-/g, '')
    PassReset.updateOne({ 
        user: user._id 
    }, {
        user: user._id,
        token: token
    }, {
        upsert: true
    })
    .then( updateResponse => {
        /* Send email to user containing password reset link. */
        const resetLink = `https://braandly.com/reset-confirm/${token}`
        console.log(resetLink)
        sendEmail({
            to: 'vada.rohan9@ethereal.email', 
            subject: 'Braandly Password Reset',
            text: `Hi ${user.name}, here's your password reset link: ${resetLink}. 
            If you did not request this link, ignore it.`
          })
        res.json({success: 'Check your email address for the password reset link!'})
    })
    .catch( error => {
        req.json({error: 'Failed to generate reset link, please try again'})
    })

    // User.findOne({email})
    // .then(response =>{
    //     // res.send(response)
    //     if(response){
    //         res.send("Got it")
    //     } else{
    //         res.status(400).json({errors: {email: "Email does not exist"}})
    //     }
    // })
    // .catch(err => {
    //     res.status(400).send(err)
    // })
}

const auth_password_reset_token = async (req, res) => {
    const token = req.params.token
    const passwordReset = await PassReset.findOne({ token })

    if(passwordReset){
        res.json({success: "Token Valid"})
    } else{
        res.status(400).json({error: "Invalid Token"})
    }
}

const auth_set_password = async (req, res) => {
    const {token, password} = req.body
    const passwordReset = await PassReset.findOne({ token })
    
    /* Update user */
  let user = await User.findOne({ _id: passwordReset.user })
  user.password = password
  
  user.save().then( async savedUser =>  {
    /* Delete password reset document in collection */
    await PassReset.deleteOne({ _id: passwordReset._id })
    res.json({success: "Password Changed Successfull"})
  })
  .catch( error => {
    req.status(400).json({error: 'Failed to reset password please try again'})
  })
}

module.exports = {
    auth_signup,
    auth_login,
    auth_password_reset,
    auth_password_reset_token,
    auth_set_password
}