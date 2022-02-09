const axios = require("axios");

const questionFetchQuestion = async () => {
  const questionFetch = await axios.get(
    "https://opentdb.com/api.php?amount=50&category=31&type=multiple"
  );

  // console.log(questionFetch.data.results)
  const results = questionFetch.data.results;
  results.map((result) => {
    result.book_of_bible = result.difficulty;
    result.answers = [...result.incorrect_answers, result.correct_answer];
  });

  return results;
};


module.exports = {
    questionFetchQuestion
};
