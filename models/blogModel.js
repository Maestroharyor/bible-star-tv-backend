const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/userModel')

//Create BlogSchema
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title note added"],
    },
    excerpt: {
      type: String,
      // required: [true, "Excerpt not added"],
    },
    slug: {
      type: String,
      required: [true, "URL not added"],
      unique: [true, "Url already exits"],
    },
    category: {
      type: [String],
      required: [true, "Category Not Added"],
    },
    featured_image: {
      url: String,
      thumbnail: String,
      fileID: String
    },
    body: {
      type: String,
      required: [true, "Blog body empty"],
    },
    created_by: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstname: String,
        lastname: String,
        email: String
    },
  },
  { timestamps: true }
);

//Create Model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog