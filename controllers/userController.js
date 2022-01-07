const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


const decodeToken = (token) => {
    let validToken;
    jwt.verify(token, "Fovero21biblestar", (err, decodedToken) => {
    validToken = decodedToken.id
    })

    return validToken;
} 

const get_users = (req, res) => {

}


const get_single_user = (req, res) => {
  User.findById(req.params.id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.send(error);
    });
};

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
    get_users,
    get_single_user,
    update_user,
    delete_user
}