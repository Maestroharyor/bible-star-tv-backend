const mongoose = require("mongoose");
const Vote = require("../models/voteModel");
const User = require("../models/userModel");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_votes = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
  const startIndex = (page - 1) * per_page;

  if (req.query.id) {
    try {
      // const user = await User.findById(req.query.id)
      // console.log(user)
      const count = await Vote.count({ "created_by.id": req.query.id });
      const data = await Vote.find({ "created_by.id": req.query.id })
        .limit(per_page)
        .skip(startIndex);
      if (count === 0) {
        res.send({ message: "No Data Found", data });
      }
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ error: "error", message: e.message });
    }
  } else {
    try {
      const count = await Vote.count();
      const query = await Vote.find().limit(per_page).skip(startIndex);
      res.send(paginated_result(page, per_page, count, query));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

const get_single_vote = async (req, res) => {
  Vote.findById(req.params.id)
    .then((response) => {
      if (Object.keys.length === 0) {
        res.status(404).send({ error: "Vote Not Found" });
      } else {
        res.status(200).send(response);
      }
    })
    .catch((error) => {
      res.status(404).send({ error, message: "Vote Not Found" });
    });
};

const create_vote = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  const [user, votedUser] = await Promise.all([
    User.findById(tokenID),
    User.findById(req.params.userID)
  ]);

  if (user.user_role !== "subscriber") {
    res.status(400).send({
      error: "Unautorized_access",
      message: "Only Subscribers are allowed to vote"
    });
  } else {
    const userDets = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    };

    const voted_for = {
      id: votedUser._id,
      firstname: votedUser.firstname,
      lastname: votedUser.lastname,
      email: votedUser.email
    };
    // console.log(user)

    const body = { ...req.body, voted_for, created_by: userDets };
    Vote.create(body)
      .then((response) => {
        res
          .status(200)
          .send({ data: response, message: "Vote created Successfully" });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
};

const update_vote = async (req, res) => {
  if (Object.keys(req.body).length <= 0) {
    res.status(400).json({ errors: "No body sent in request for update" });
  }

  const vote = await Vote.findById(req.params.id);

  // console.log(req.body)
  const body = { ...req.body };

  Vote.findByIdAndUpdate(req.params.id, body, { useFindAndModify: false })
    .then((response) => {
      res.status(200).send({ success: "Post Successfully Updated" });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

const delete_vote = async (req, res) => {
  Vote.findByIdAndDelete(req.body.id)
    .exec()
    .then((response) => {
      res.send({ message: "Post Deleted Successfully", data: response });
    })
    .catch((error) => {
      res.send(error);
    });
};

module.exports = {
  get_votes,
  get_single_vote,
  create_vote,
  update_vote,
  delete_vote
};
