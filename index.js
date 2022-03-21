const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const axios = require('axios');
const dotenv = require("dotenv/config");
const ImageKit = require("imagekit");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

const routes = require("./routes/api");
// const { braandlySeeder } = require("./middlewares/seeding");
// const User = require("./models/userModel");
// const createSeedData = require("./data/user_data");
// const { blog_seed_data } = require("./data/blog_data");
// const Audition = require("./models/auditionModel");
// const { questionFetchQuestion } = require("./data/audition_demo_data");
const AuditionData = require("./data/audition_data.json");
// const Blog = require("./models/blogModel");
// const blogFetch = require("./data/blog_data");
// const { Seeder } = require("express-seeder");

const app = express();

// const audition_data = AuditionData;
// audition_data.map((data) => {
//   data.answers = data.answers.split(",");
//   return data;
// });

// console.log(audition_data)

const imagekit = new ImageKit({
  publicKey: "public_e5cs35YbhlFkCwLY3xvugmZSkXs=",
  privateKey: "private_ccuMYbinBva8q6tadUL35gky8ig=",
  urlEndpoint: "https://ik.imagekit.io/jwjlkphqy5y"
});

//Midddlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes Handler
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/upload/auth", (req, res) => {
  try {
    const token = req.query.token || uuid.v4();
    const expiration =
      req.query.expire || parseInt(Date.now() / 1000) + 60 * 10; // Default expiration in 10 mins

    const signatureObj = imagekit.getAuthenticationParameters(
      token,
      expiration
    );

    res.status(200).send(signatureObj);
  } catch (err) {
    console.error(
      "Error while responding to auth request:",
      JSON.stringify(err, undefined, 2)
    );
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/upload/:fileid", (req, res) => {
  imagekit.deleteFile(req.params.fileid, function (error, result) {
    if (error) {
      res.send({ message: "Error deleting image", error });
      console.log(error);
    } else {
      console.log(result);
      res.send({ message: "Image deleted successfully", result });
    }
  });
});

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).send("Error 404");
});

// database connection
const dbURI =
  "mongodb+srv://Fovero:Fovero21biblestar@bible-star-tv.kcjzu.mongodb.net/biblestars?retryWrites=true&w=majority";
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
