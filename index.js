const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const axios = require('axios');
const dotenv = require("dotenv/config");
const routes = require("./routes/api");
const { braandlySeeder } = require("./middlewares/seeding");
const User = require("./models/userModel");
const createSeedData = require("./data/user_data");
const { blog_seed_data } = require("./data/blog_data");
const Audition = require("./models/auditionModel");
const { questionFetchQuestion } = require("./data/audition_demo_data");
const AuditionData = require('./data/audition_data.json')
const Blog = require("./models/blogModel");
const blogFetch = require("./data/blog_data");
const {Seeder} = require('express-seeder')

const app = express();

const audition_data = AuditionData
audition_data.map(data => {
  data.answers = data.answers.split(',')
  return data;
})

// console.log(audition_data)

//Midddlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes Handler
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).send("Error 404");
});

// database connection
const dbURI = "mongodb+srv://Fovero:Fovero21biblestar@bible-star-tv.kcjzu.mongodb.net/biblestars?retryWrites=true&w=majority";
// const dbURI = process.env.DB;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to db");
    // Seeder(audition_data, Audition)
    // let user_seed_data = createSeedData(1000);

    // console.log({audition_seed_data})
    // console.log({user_seed_data})
    // braandlySeeder(user_seed_data, User)

    //     let audition_seed_data;

    // (async function() {
    //   try {
    //     audition_seed_data = await questionFetchQuestion();
    //     braandlySeeder(audition_data, Audition)
    //     // console.log({audition_seed_data})
    //   } catch (e) {
    //     return console.log(e);
    //   }
    // })()
    // // console.log({audition_seed_data})

    // (async function() {
    //   try {
    //     let blog_seed_data = await blogFetch();
    //     braandlySeeder(blog_seed_data, Blog) 
    //     // console.log({blog_seed_data})
    //   } catch (e) {
    //     return console.log(e);
    //   }
    // })()

  })
  .catch((err) => console.log(err));

//Starting server
app.listen(process.env.port || 8000, () => {
  console.log("Now Listening for requests");
});

//Middlewares
// app.use(express.static('public'));
// app.use(express.urlencoded({extended: true}));
