const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes/api');
const {braandlySeeder} = require('./middlewares/seeding');
const User = require('./models/userModel');
// const users = require('./data/brands/seedData.json')
const faker = require('faker');


const user_role_types = ['subscriber', 'contestant', 'admin']


const seed_data = []

for (let i=0; i<=500; i++){
  const testData = {
    firstname:faker.name.firstName(),
    lastname:faker.name.lastName(),
    username: `${faker.name.firstName()}-${faker.name.lastName()}`,
    password: "123456",
    email: faker.internet.email(),
    user_role: user_role_types[Math.ceil(Math.random() * user_role_types.length) - 1],
  }
  if(testData.user_role === "contestant"){
    testData.my_stats = {
      total_points:Math.floor(Math.random() * (40 - 0 + 1)) + 0,
      total_attempts:Math.floor(Math.random() * (15 - 0 + 1)) + 0,
      wallet_balance:Math.floor(Math.random() * (4000 - 500 + 1)) + 500,
      amount_spent:Math.floor(Math.random() * (6000 - 500 + 1)) + 500,
      total_votes:Math.floor(Math.random() * (100 - 10 + 1)) + 10,
    }
  }
  seed_data.push(testData)
}

// console.log(seed_data)

const app = express();

//Midddlewares
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
const dbURI = 'mongodb+srv://Fovero:Fovero21biblestar@bible-star-tv.kcjzu.mongodb.net/biblestars?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log("Connected to db");
    braandlySeeder(seed_data, User)
  })
  .catch((err) => console.log(err));



//Starting server
app.listen(process.env.port || 3050, ()=>{
    console.log("Now Listening for requests")
});



//Middlewares
// app.use(express.static('public'));
// app.use(express.urlencoded({extended: true}));


