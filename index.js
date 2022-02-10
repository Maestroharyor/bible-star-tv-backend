const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var cors = require('cors');
// const axios = require('axios');
const dotenv = require('dotenv/config');
const routes = require('./routes/api');
// const {braandlySeeder} = require('./middlewares/seeding');
// const User = require('./models/userModel');
// const {user_seed_data} = require('./data/user_data');
// const {blog_seed_data} = require('./data/blog_data');
// const Audition = require('./models/auditionModel');
// const {questionFetchQuestion} = require('./data/audition_data');
// const Blog = require('./models/blogModel');
// const {blogFetch} = require('./data/blog_data');


// let audition_seed_data;

// (async function() {
//   try {
//     audition_seed_data = await questionFetchQuestion();
//     braandlySeeder(audition_seed_data, Audition)
//     console.log({audition_seed_data})
//   } catch (e) {
//     return console.log(e);
//   }
// })()
// console.log({audition_seed_data})



// (async function() {
//   try {
//     let blog_seed_data = await blogFetch();
//     braandlySeeder(blog_seed_data, Blog)
//     // console.log({blog_seed_data})
//   } catch (e) {
//     return console.log(e);
//   }
// })()



const app = express();

//Midddlewares
app.use(cors()
app.use(express.json());
app.use(cookieParser());


//Routes Handler
app.get("/", (req, res)=>{
  res.send("Welcome")
})

app.use('/api', routes)


app.use("*", (req, res) => {
res.status(404).send("Error 404")
})


// database connection
// const dbURI = 'mongodb+srv://Fovero:Fovero21biblestar@bible-star-tv.kcjzu.mongodb.net/biblestars?retryWrites=true&w=majority';
const dbURI = process.env.DB;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log("Connected to db");
  
    // console.log({audition_seed_data})
    // braandlySeeder(user_seed_data, Audition)
    // braandlySeeder(audition_seed_data, User)
  })
  .catch((err) => console.log(err));



//Starting server
app.listen(process.env.port || 3050, ()=>{
    console.log("Now Listening for requests")
});



//Middlewares
// app.use(express.static('public'));
// app.use(express.urlencoded({extended: true}));


