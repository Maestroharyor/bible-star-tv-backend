const mongoose = require("mongoose")

const dbURI = "mongodb+srv://Fovero:Fovero21biblestar@bible-star-tv.kcjzu.mongodb.net/biblestars?retryWrites=true&w=majority";

const conn = mongoose.createConnection(dbURI)

module.exports = {
    dbURI, conn
}