const mongoose = require('mongoose');
const Announcement = require("../models/announcementModel");
const User = require("../models/userModel");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_announcements = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;

    try {
        const count = await Announcement.count();
        const query = await Announcement.find().limit(per_page).skip(startIndex);
        res.send(paginated_result(page, per_page, count, query))
        // next();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }

}
const search_announcements = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;
    
    if(req.query.term){
        const url = req.query.name
        const searchQuery = await Announcement.find({title : {$regex : String(req.query.term)}}).limit(per_page).skip(startIndex)
        const count = await Announcement.find({title : {$regex : String(req.query.term)}}).count()

        if(!searchQuery || searchQuery.length === 0){
        res.status(400).send({error : "No Blog was found"}) 
        } 
        // console.log(paginated_result(page, per_page, count, searchQuery))
        res.status(200).send(paginated_result(page, per_page, count, searchQuery))

    } else{
        res.status(401).send({error : "invalid_search_term", message: "No Search term was sent"}) 
    }

}

const get_single_announcement = async (req, res) => {
    console.log(req.params)
    // const announcement = await Announcement.find({slug: "this-is-a-slug"}).exec()
    // console.log(announcement)
    Announcement.find({slug: req.params.slug}).exec()
    .then((response) => {
    //   if (Object.keys.length === 0) {
    //     res.status(404).send({ error: "Announcement Not Found" });
    //   }
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(404).send({error, message: "Announcement Not Found"});
    });

}

const create_announcement = async (req, res) => {
    const tokenID = decodeToken(req.headers.authorization.substr(7));
    const user = await User.findById(tokenID)
    const userDets = {id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email}
    // console.log(user)
    const body = {...req.body, created_by: userDets};
    if(!body.slug){
        body.slug = body.title.split(" ").join("-") + "-" + Math.floor(Math.random() * (1000000 - 0 + 1)) + 0
    }
    Announcement.create(body)
    .then(response => {
        res.status(200).send({data: response, message: "Announcement created Successfully"})
    })
    .catch(err => {
        res.status(400).send(err)
    })

}

const update_announcement = async (req, res) => {
    if(Object.keys(req.body).length <= 0){
        res.status(400).json({errors: "No body sent in request for update"})
    }
    
    const announcement = await Announcement.findById(req.params.id)


   
    const body = {...req.body}

    Announcement.findByIdAndUpdate(req.params.id, body, {useFindAndModify: false})
    .then(response => {
        res.status(200).send({success: "Announcement Successfully Updated"})
    })
    .catch(err => {
        res.status(404).send(err)
    })

}

const delete_announcement = async (req, res) => {
    Announcement.findByIdAndDelete(req.body.id).exec()
    .then(response => {
        res.send({message:"Annoncement Deleted Successfully", data: response})
    })
    .catch(error => {
        res.send(error)
    })

}

module.exports = {
    get_announcements,
    search_announcements,
    get_single_announcement,
    create_announcement,
    update_announcement,
    delete_announcement  
}
