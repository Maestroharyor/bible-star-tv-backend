const User = require('../models/userModel');
const DeletedUser = require('../models/deletedUserModel');
const jwt = require('jsonwebtoken');


const decodeToken = (token) => {
    let validToken;
    jwt.verify(token, "braandly@maestroJoshAd21!!!", (err, decodedToken) => {
    validToken = decodedToken.id
    })

    return validToken;
} 


const get_user = (req, res) => {
    User.findById(req.params.id)
    .then(response => {
        res.status(200).send(response)
    })
    .catch(error => {
        res.send(error)
    })
}

const get_brands = (req, res) => {
    User.findById(decodeToken(req.headers.authorization.substr(7)))
    .then(response => {
        if(response.brands.length <= 0){
            res.send("You don't have any brands saved/created yet")
        } else{
           res.status(200).send(response.brands) 
        }
        
    })
    .catch(error => {
        res.status(400).send(error)
    })
}

const get_palettes = (req, res) => {
    User.findById(decodeToken(req.headers.authorization.substr(7)))
    .then(response => {
        if(response.palettes.length <= 0){
            res.send("You don't have any palettes saved/created yet")
        } else{
            res.status(200).send(response.palettes)
        }
        
    })
    .catch(error => {
        res.status(400).send(error)
    })
}

const get_gradients = (req, res) => {
    User.findById(decodeToken(req.headers.authorization.substr(7)))
    .then(response => {
        if(response.gradients.length <= 0){
            res.send("You don't have any gradients saved/created yet")
        } else{
           res.status(200).send(response.gradients) 
        }
        
    })
    .catch(error => {
        res.status(400).send(error)
    })
}


const get_fonts = (req, res) => {
    User.findById(decodeToken(req.headers.authorization.substr(7)))
    .then(response => {
        if(response.fonts.length <= 0){
            res.status(200).send("You don't have any fonts saved/created yet")
        } else{
          res.status(200).send(response.fonts)  
        }
        
    })
    .catch(error => {
        res.status(400).send(error)
    })
}

const update_user = (req, res) => {
    if(Object.keys(req.body).length <= 0){
        res.status(400).json({errors: "No body sent in request for update"}) 
    }
    User.findByIdAndUpdate(decodeToken(req.headers.authorization.substr(7)), req.body, {useFindAndModify: false})
    .then(response => {
        res.status(200).send({success: "User Successfully Updated"})
    })
    .catch(error => {
        if(error.path == "_id"){
            res.status(400).json({errors: "Invalid User ID Sent"})  
        }
        res.status(400).send(error)
    })
}

const delete_user = async (req, res) => {
    const user = await User.findById(decodeToken(req.headers.authorization.substr(7)));
    DeletedUser.create({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        user_role: user.user_role,
        plan: user.plan.name,
    })

    User.findByIdAndDelete(decodeToken(req.headers.authorization.substr(7)))
    .then(response => {
        res.send({success: "User Account Deleted Successfully"})
    })
    .catch(error => {
        res.send(error)
    })
    // res.send("User Single Delete Request working")
}


module.exports = {
    get_user,
    get_brands,
    get_palettes,
    get_gradients,
    get_fonts,
    update_user,
    delete_user
}