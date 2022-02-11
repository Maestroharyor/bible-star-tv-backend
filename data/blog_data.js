const axios = require("axios");

const blogFetch = async () => {
  const [blogFetchReq, blogImages] = await axios.all([
    axios.get("https://jsonplaceholder.typicode.com/posts"),
    axios.get("https://jsonplaceholder.typicode.com/photos")
  ]);

  const results = blogFetchReq.data;
  const images = blogImages.data;
  const category = ["news", "updates", "lessons", "messages"];
  console.log(results);
  results.map((result, index) => {
    result.slug = result.title.split(" ").join("-");
    result.excerpt = result.title.substring(0, 90);
    result.category = category[Math.ceil(Math.random() * category.length) - 1];
    result.featured_image = images[index].url
  });

  return results;
};

module.exports = 
  blogFetch
