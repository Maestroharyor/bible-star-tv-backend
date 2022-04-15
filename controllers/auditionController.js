const Audition = require("../models/auditionModel");
const User = require("../models/userModel");
const Fund = require("../models/fundsModel");
const { filterObject } = require("../functions/utilities");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_all_auditions = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
  const startIndex = (page - 1) * per_page;

  if (req.query.book) {
    try {
      const count = await Audition.count({ book_of_bible: req.query.book });
      const data = await Audition.find({ book_of_bible: req.query.book })
        .limit(per_page)
        .skip(startIndex);
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    try {
      const count = await Audition.count();
      const data = await Audition.find().limit(per_page).skip(startIndex);
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

const get_books_of_bible_audition = async (req, res) => {
  try {
    const data = await Audition.find().distinct("book_of_bible").exec();
    res.send({ data });
    // next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const audition = async (req, res) => {
  if (req.query.book) {
    try {
      const count = await Audition.count({ book_of_bible: req.query.book });
      const data = await Audition.find({ book_of_bible: req.query.book })
        .limit(2)
        .skip(Math.floor(Math.random() * count));
      // res.send(paginated_result(page, per_page, count, data))
      res.send(data);
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    try {
      const count = await Audition.count();
      const data = await Audition.find()
        .limit(2)
        .skip(Math.floor(Math.random() * count));
      // res.send(paginated_result(page, per_page, count, data))
      res.send(data);
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

const answer_audition = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  if (req.body.id === undefined) {
    res.status(400).json({
      error: {
        type: "no_data_sent",
        message: "No payload gotten for answering"
      }
    });
  }
  const { id, answer } = req.body;
  const [audition, user] = await Promise.all([
    Audition.findById(id),
    User.findById(tokenID)
  ]);

  console.log({ answer });
  console.log(audition);
  console.log(user);

  let { total_points, total_attempts, wallet_balance, amount_spent } =
    user.my_stats;
  let { auditioned_questions } = user;

  console.log({ total_points, total_attempts, wallet_balance, amount_spent });

  // if(wallet_balance < 500){
  //     res.status(400).json({error: {
  //     type:"insufficient_funds",
  //     message:"You don't have enough balance. Please recharge"
  // }})
  // }

  if (audition.correct_answer == answer) {
    console.log("Correct");
    // my_stats: {
    //     total_points: 0,
    //     total_attempts: 0,
    //     wallet_balance: 0,
    //     amount_spent: 0,
    //     total_votes: 0
    //   }

    let newStats = {
      wallet_balance: wallet_balance,
      amount_spent: amount_spent,
      total_points: (total_points += 1),
      // total_attempts: total_attempts ? (total_attempts += 1) : 1
    };

    let updatedAuditions;
    if (auditioned_questions === undefined) {
      updatedAuditions = [audition._id];
    } else {
      updatedAuditions = [...auditioned_questions, audition._id];
    }

    console.log(updatedAuditions);

    User.findByIdAndUpdate(
      tokenID,
      { my_stats: newStats, auditioned_questions: updatedAuditions },
      { useFindAndModify: false }
    )
      .then((response) => {
        console.log("User Updated");
        res.status(200).json({ status: "right", message: "You got it right" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  } else {
    let newStats = {
      wallet_balance: wallet_balance,
      amount_spent: amount_spent,
      total_points,
      total_attempts: (total_attempts += 1)
    };
    let updatedAuditions;
    if (auditioned_questions === undefined) {
      updatedAuditions = [audition._id];
    } else {
      updatedAuditions = [...auditioned_questions, audition._id];
    }

    User.findByIdAndUpdate(
      tokenID,
      { my_stats: newStats, auditioned_questions: updatedAuditions },
      { useFindAndModify: false }
    )
      .then((response) => {
        console.log("User Updated");
        res.status(200).json({ status: "wrong", message: "You got it wrong" });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
  // console.log({audition}, {user})
  // res.end()
};

const start_audition = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));

  const user = await User.findById(tokenID);

  let { total_points, total_attempts, wallet_balance, amount_spent } =
    user.my_stats;

  if (wallet_balance < 500) {
    res.status(400).json({
      error: {
        type: "insufficient_funds",
        message: "You don't have enough balance. Please recharge"
      }
    });
  }

  let newStats = {
    wallet_balance: (wallet_balance -= 250),
    amount_spent: (amount_spent += 250),
    total_points: total_points,
    total_attempts: total_attempts ? (total_attempts += 1) : 1
  };

  const userDets = {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  };

  User.findByIdAndUpdate(
    tokenID,
    { my_stats: newStats },
    { useFindAndModify: false }
  )
    .then((response) => {
      console.log("250 naira deducted");

      // const {details, amount, type , category} = req.body;

      return Fund.create({
        details: "250 naira deducted for audition",
        amount: 250,
        type: "subtraction",
        category: "audition",
        created_by: userDets
      });
    })
    .then((response2) => {
      res
        .status(200)
        .json({ status: "deducted", message: "250 naira deducted" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const add_audition = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errors: "No body sent in request for update" });
  }

  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const user = await User.findById(tokenID);

  if (user.user_role === "superadmin" || user.user_role === "admin") {
    const { question, answers, book_of_bible, correct_answer } = req.body;
    Audition.create({
      question,
      answers,
      book_of_bible,
      correct_answer,
      created_by: user._id
    })
      .then((response) => {
        res.status(200).json({
          status: "success",
          message: "Question Created Successfully",
          data: response
        });
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } else {
    res.status(400).send({
      error: "unauthorized_access",
      message: "Admin access needed to create questions"
    });
  }
};

const get_single_audition = (req, res) => {
  Audition.findById(req.params.id)
    .then((response) => {
      if (Object.keys.length === 0) {
        res.status(404).send({
          error: {
            type: "user_error",
            message: "User Not Found"
          }
        });
      }
      res
        .status(200)
        .send(filterObject(JSON.parse(JSON.stringify(response)), "password"));
    })
    .catch((error) => {
      res.status(404).send({ message: "No Audition Found", error });
    });
};

const update_audition = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const user = await User.findById(tokenID);
  console.log(user);

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errors: "No body sent in request for update" });
  }

  if (user.user_role === "superadmin" || user.user_role === "admin") {
    Audition.findByIdAndUpdate(req.params.id, req.body, {
      useFindAndModify: false
    })
      .then((response) => {
        res.status(200).send({ message: "Question Successfully Updated" });
      })
      .catch((error) => {
        // if(error.path == "_id"){
        //     res.status(400).json({errors: "Invalid Audition ID Sent"})
        // }
        res.status(400).send(error);
      });
  } else {
    res.status(400).send({
      error: "unauthorized_access",
      message: "Admin access needed to update questions"
    });
  }
};

const delete_audition = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const user = await User.findById(tokenID);

  if (user.user_role === "admin" || user.user_role === "superadmin") {
    Audition.findByIdAndDelete(req.params.id)
      .then((response) => {
        res
          .status(200)
          .send({ message: "Audition Question Deleted Successfully" });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.status(400).send({
      error: "unauthorized_access",
      message: "Admin access needed to delete questions"
    });
  }

  // res.send("User Single Delete Request working")
};

module.exports = {
  get_all_auditions,
  get_books_of_bible_audition,
  audition,
  add_audition,
  start_audition,
  answer_audition,
  get_single_audition,
  update_audition,
  delete_audition
};
