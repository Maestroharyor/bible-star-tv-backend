const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');

module.exports.tokenVerify = (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.substr(7);

        jwt.verify(token, "braandly@maestroJoshAd21!!!", (err, decodedToken) => {
            if(err){
                console.log(err)
                res.status(400).send({error: "Invalid Token Gotten"})
            } else{
                // console.log(decodedToken)
                next()                
            }
        })

    } else {
        res.status(400).send({error: "Unauthorized access detected!!!"})
    }
}