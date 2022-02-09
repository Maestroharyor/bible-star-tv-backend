const axios = require("axios");

const blogFetch= async () => {
  const blogFetchReq = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );

  const results = blogFetchReq.data;
  const category = ['a', 'b', 'c', 'd']
  console.log(results)
  results.map((result) => {
    result.category = category[Math.ceil(Math.random() * category.length) - 1]
  });

  return results;
};


module.exports = {
    blogFetch
};
