
const faker = require('faker');

const user_role_types = ['subscriber', 'contestant', 'admin', 'superadmin']
const batch_types = ['A', 'B', 'C', 'D']

const seed_data = []

for (let i=0; i<=500; i++){
  const testData = {
    firstname:faker.name.firstName(),
    lastname:faker.name.lastName(),
    username: `${faker.name.firstName()}-${faker.name.lastName()}`,
    password: "123456",
    email: faker.internet.email(),
    user_role: user_role_types[Math.ceil(Math.random() * user_role_types.length) - 1],
    batch: batch_types[Math.ceil(Math.random() * batch_types.length) - 1],
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

module.exports.seed_data