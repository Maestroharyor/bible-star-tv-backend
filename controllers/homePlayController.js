const HomePlay = require("../models/homePlayModel");
const User = require("../models/userModel");
const Fund = require("../models/fundsModel");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_all_homeplays = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
  const startIndex = (page - 1) * per_page;

  if (req.query.book) {
    try {
      const count = await HomePlay.count({ book_of_bible: req.query.book });
      const data = await HomePlay.find({ book_of_bible: req.query.book })
        .limit(per_page)
        .skip(startIndex);
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    try {
      const count = await HomePlay.count();
      const data = await HomePlay.find().limit(per_page).skip(startIndex);
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

const answer_homeplay = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  if (req.body.id === undefined) {
    res.status(400).json({
      error: {
        type: "no_data_sent",
        message: "No payload gotten for answering",
      },
    });
  }

  if (!tokenID) {
    res.status(401).json({
      error: {
        type: "unauthorized_access",
        message: "You are not authorized to answer questions",
      },
    });
  }

  const user = await User.findById(tokenID);
  const userDets = {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  };

  let { wallet_balance, amount_spent, total_votes } = user.subscriber_stats;

  if (user.user_role !== "subscriber") {
    res.status(401).json({
      error: {
        type: "unauthorized_access",
        message: "You are not allowed to answer questions",
      },
    });
  }

  if (wallet_balance < 100) {
    res.status(400).json({
      error: {
        type: "insufficient_funds",
        message: "You don't have enough balance. Please recharge",
      },
    });
  }

  Fund.create({
    details: "100 naira deducted for audition",
    amount: 100,
    type: "subtraction",
    category: "homeplay",
    created_by: userDets
  });


  const { id, answer } = req.body;
  const homeplayquestion = await HomePlay.findById(id);

  console.log({ answer });
  console.log(audition);
  console.log(user);

  //   let { auditioned_questions } = user;

  console.log({ wallet_balance, amount_spent });

  if (homeplayquestion.correct_answer.includes(answer.toLowerCase())) {
    console.log("Correct");

    let newStats = {
      wallet_balance: wallet_balance - 100,
      amount_spent: amount_spent + 100,
      total_votes,
    };

    User.findByIdAndUpdate(
      tokenID,
      { subscriber_stats: newStats },
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
      total_attempts: total_attempts ? (total_attempts += 1) : 1,
    };
    let updatedHomePlays;
    if (auditioned_questions === undefined) {
      updatedHomePlays = [audition._id];
    } else {
      updatedHomePlays = [...auditioned_questions, audition._id];
    }

    User.findByIdAndUpdate(
      tokenID,
      { my_stats: newStats, auditioned_questions: updatedHomePlays },
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

const add_homeplay = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errors: "No body sent in request for update" });
  }

  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const user = await User.findById(tokenID);

  if (user.user_role === "superadmin" || user.user_role === "admin") {
    const { question, answers, book_of_bible, correct_answer } = req.body;
    HomePlay.create({
      question,
      answers,
      book_of_bible,
      correct_answer,
      created_by: user._id,
    })
      .then((response) => {
        res.status(200).json({
          status: "success",
          message: "Question Created Successfully",
          data: response,
        });
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } else {
    res.status(400).send({
      error: "unauthorized_access",
      message: "Admin access needed to create questions",
    });
  }
};

const update_homeplay = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const user = await User.findById(tokenID);
  console.log(user);

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errors: "No body sent in request for update" });
  }

  if (user.user_role === "superadmin" || user.user_role === "admin") {
    HomePlay.findByIdAndUpdate(req.params.id, req.body, {
      useFindAndModify: false,
    })
      .then((response) => {
        res.status(200).send({ message: "Question Successfully Updated" });
      })
      .catch((error) => {
        // if(error.path == "_id"){
        //     res.status(400).json({errors: "Invalid HomePlay ID Sent"})
        // }
        res.status(400).send(error);
      });
  } else {
    res.status(400).send({
      error: "unauthorized_access",
      message: "Admin access needed to update questions",
    });
  }
};

const delete_homeplay = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const user = await User.findById(tokenID);

  if (user.user_role === "admin" || user.user_role === "superadmin") {
    HomePlay.findByIdAndDelete(req.params.id)
      .then((response) => {
        res
          .status(200)
          .send({ message: "HomePlay Question Deleted Successfully" });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.status(400).send({
      error: "unauthorized_access",
      message: "Admin access needed to delete questions",
    });
  }

  // res.send("User Single Delete Request working")
};

module.exports = {
  add_homeplay,
  get_all_homeplays,
  answer_homeplay,
  update_homeplay,
  delete_homeplay,
};
