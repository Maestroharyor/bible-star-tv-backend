const mongoose = require('mongoose');
const User = require("../models/userModel");
const Fund = require("../models/fundsModel");
const { filterObject } = require("../functions/utilities");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_all_funds = async(req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;

    if(req.query.id){
        try {
            // const user = await User.findById(req.query.id)
            // console.log(user)
            const count = await Fund.count({"created_by.id": req.query.id});
            const data = await Fund.find({"created_by.id": req.query.id}).limit(per_page).skip(startIndex);
            if(count === 0){
                res.send({message: "No Data Found", data})
            }
            res.send(paginated_result(page, per_page, count, data))
            // next();
        } catch (e) {
            res.status(500).json({error:"error", message: e.message });
        }

    } else{
        try {
            const count = await Fund.count();
            const data = await Fund.find().limit(per_page).skip(startIndex);
            res.send(paginated_result(page, per_page, count, data))
            // next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        } 
    }

   
}


const get_all_audition_funds = async(req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;

    try {
        const count = await Fund.count({category: "audition"});
        const data = await Fund.find({category: "audition"}).limit(per_page).skip(startIndex);
        if(count === 0){
            res.send({message: "No Data Found", data})
        }
        res.send(paginated_result(page, per_page, count, data))
        // next();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


const get_all_voting_funds = async(req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;

    try {
        const count = await Fund.count({category: "voting"});
        const data = await Fund.find({category: "voting"}).limit(per_page).skip(startIndex);
        if(count === 0){
            res.send({message: "No Data Found", data})
        }
        res.send(paginated_result(page, per_page, count, data))
        // next();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


const get_single_funds = async(req, res) => {
    Fund.findById(req.params.id)
    .then((response) => {
      if (Object.keys.length === 0) {
        res.status(404).send({ error: "Fund record Not Found" });
      }
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(404).send({error, message: "User Not Found"});
    });
}

const add_funds = async (req, res) => {
    const tokenID = decodeToken(req.headers.authorization.substr(7));
    const user = await User.findById(tokenID)
    // console.log({user})
    const {details, amount, type , category} = req.body;
    const userDets = {id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email}
    // console.log(userDets)
    const body = {...req.body, created_by: userDets}
    // console.log(body)
    Fund.create(body)
    .then(response => {
        const my_stats = {
            total_points: user.my_stats.total_points,
            total_attempts: user.my_stats.total_attempts,
            wallet_balance: user.my_stats.wallet_balance + Number(amount),
            amount_spent: user.my_stats.amount_spent,
            total_votes: user.my_stats.total_votes
          };
        return User.findByIdAndUpdate(tokenID, {my_stats}, {
            useFindAndModify: false
          });
    })
    .then( response2 => {
        res.status(200).send({ message: "Fund record Created Successfully"});
    })
    .catch(err => {
        res.status(400).send(err)
    })
}

const edit_single_funds = async (req, res) => {
    if(Object.keys(req.body).length <= 0){
        res.status(400).json({errors: "No body sent in request for update"})
    }
    const tokenID = decodeToken(req.headers.authorization.substr(7));

  try {
    User.findById(tokenID)
    .then(response => {
        // console.log({"id from database": mongoose.Types.ObjectId(response._id).toString()}, {tokenID})
        const UserID = mongoose.Types.ObjectId(response._id).toString();
        if (response.user_role === "superadmin") {
            return User.findByIdAndUpdate(req.params.id, req.body, {useFindAndModify: false})
        }

        res.status(401).send({error: "Unauthorized Access"});
    })
    .then(response2 => {
        res.status(200).send({success: "Fund Record Successfully Updated"})
    })

    .catch(err => {
        res.status(404).send(err)
    })

  } catch (e) {
    res.send(e);
  }

}

const delete_single_funds = async (req, res) => {
    const tokenID = decodeToken(req.headers.authorization.substr(7));

  try {
    User.findById(tokenID)
    .then(response => {
        if (response.user_role === "superadmin") {
            return Fund.findByIdAndDelete(req.params.id)
        }

        res.status(401).send({error: "anauthorized_access", message: "User not permitted to delete fund record"});
    })
    .then(response2 => {
        res.status(200).send({ success: "Fund Record Deleted Successfully" });
    })

    .catch(err => {
        res.status(404).send(err)
    })

  } catch (e) {
    res.send(e);
  }

}


module.exports = {
    get_all_funds,
    get_all_audition_funds,
    get_all_voting_funds,
    get_single_funds,
    add_funds,
    edit_single_funds,
    delete_single_funds
}