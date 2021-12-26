const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const app = express();

//Midddlewares
app.use(express.json());
app.use(cookieParser());

//Routes Handler
app.get("/", (req, res)=>{
    res.send("Welcome")
})


app.use("*", (req, res) => {
  res.status(404).send("Error 404")
})


// database connection
// const dbURI = 'mongodb+srv://Maestro:Maestro2394n1!@braandly-database.xutyi.mongodb.net/Braandly?retryWrites=true&w=majority';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
//   .then((result) => {
//     console.log("Connected to db");
//   })
//   .catch((err) => console.log(err));



//Starting server
app.listen(process.env.port || 3050, ()=>{
    console.log("Now Listening for requests")
});

//Middlewares
// app.use(express.static('public'));
// app.use(express.urlencoded({extended: true}));


