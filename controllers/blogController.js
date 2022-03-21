const mongoose = require('mongoose');
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_blogs = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;

    try {
        const count = await Blog.count();
        const query = await Blog.find().limit(per_page).skip(startIndex);
        res.send(paginated_result(page, per_page, count, query))
        // next();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }

}
const search_blogs = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
    const startIndex = (page - 1) * per_page;
    
    if(req.query.term){
        const url = req.query.name
        const searchQuery = await Blog.find({title : {$regex : String(req.query.term)}}).limit(per_page).skip(startIndex)
        const count = await Blog.find({title : {$regex : String(req.query.term)}}).count()

        if(!searchQuery || searchQuery.length === 0){
        res.status(400).send({error : "No Blog was found"}) 
        } 
        // console.log(paginated_result(page, per_page, count, searchQuery))
        res.status(200).send(paginated_result(page, per_page, count, searchQuery))

    } else{
        res.status(401).send({error : "invalid_search_term", message: "No Search term was sent"}) 
    }

}

const get_single_blog = async (req, res) => {
    Blog.findById(req.params.id)
    .then((response) => {
      if (Object.keys.length === 0) {
        res.status(404).send({ error: "Post Not Found" });
      }
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(404).send({error, message: "User Not Found"});
    });

}

const create_blog = async (req, res) => {
    const tokenID = decodeToken(req.headers.authorization.substr(7));
    const user = await User.findById(tokenID)
    const userDets = {id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email}
    // console.log(user)
    req.body.slug = req.body.title.split(" ").join("-")
    const body = {...req.body, created_by: userDets}
    Blog.create(body)
    .then(response => {
        res.status(200).send({data: response, message: "Blog post created Successfully"})
    })
    .catch(err => {
        res.status(400).send(err)
    })

}

const update_blog = async (req, res) => {
    if(Object.keys(req.body).length <= 0){
        res.status(400).json({errors: "No body sent in request for update"})
    }
    
    const blog = await Blog.findById(req.params.id)


    // console.log(req.body)
    const {category} = req.body
    const body = {...req.body}
    body.category = blog.category !== undefined ? [...blog.category, category] : [category]
    console.log(body)

    Blog.findByIdAndUpdate(req.params.id, body, {useFindAndModify: false})
    .then(response => {
        res.status(200).send({success: "Post Successfully Updated"})
    })
    .catch(err => {
        res.status(404).send(err)
    })

}

const delete_blog = async (req, res) => {
    Blog.findByIdAndDelete(req.body.id).exec()
    .then(response => {
        res.send({message:"Post Deleted Successfully", data: response})
    })
    .catch(error => {
        res.send(error)
    })

}

module.exports = {
    get_blogs,
    search_blogs,
    get_single_blog,
    create_blog,
    update_blog,
    delete_blog  
}
