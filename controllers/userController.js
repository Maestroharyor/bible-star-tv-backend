const mongoose = require("mongoose");
const User = require("../models/userModel");
const { filterObject } = require("../functions/utilities");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

const get_users = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
  const startIndex = (page - 1) * per_page;

  if (req.query.role) {
    try {
      // const user = await User.findById(req.query.id)
      // console.log(user)
      const count = await User.count({ "user_role": req.query.role });
      const data = await User.find({ "user_role": req.query.role })
        .limit(per_page)
        .skip(startIndex);
      if (count === 0) {
        res.send({ message: "No User role Found", data });
      }
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ error: "error", message: e.message });
    }
  } else {
    try {
      const count = await User.count();
      const data = await User.find().limit(per_page).skip(startIndex);
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};


const get_top_users = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
  const startIndex = (page - 1) * per_page;

    try {
      const count = await User.count({ "user_role": "contestant" });
      const data = await User.find({ "user_role": "contestant" }).sort("-my_stats.total_points").limit(per_page).skip(startIndex);
      res.send(paginated_result(page, per_page, count, data));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }

};

const get_single_user = (req, res) => {
  User.findById(req.params.id)
    .then((response) => {
      if (Object.keys.length === 0) {
        res.status(404).send({ error: "User Not Found" });
      }
      res
        .status(200)
        .send(filterObject(JSON.parse(JSON.stringify(response)), "password"));
    })
    .catch((error) => {
      res.status(404).send({ error, message: "User Not Found" });
    });
};

const update_user = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  console.log(tokenID);
  if (tokenID === undefined) {
    res
      .status(401)
      .send({ error: "Unidentified User", message: "Invalid Token Passed" });
  }

  if (Object.keys(req.body).length <= 0) {
    res.status(400).json({ errors: "No body sent in request for update" });
  }

  try {
    User.findById(tokenID)
      .then((response) => {
        console.log(
          {
            "id from database": mongoose.Types.ObjectId(response._id).toString()
          },
          { tokenID }
        );
        const UserID = mongoose.Types.ObjectId(response._id).toString();
        if (
          UserID === tokenID ||
          response.user_role === "admin" ||
          response.user_role === "superadmin"
        ) {
          return User.findByIdAndUpdate(req.params.id, req.body, {
            useFindAndModify: false
          });
        }

        res.status(401).send({ error: "Unauthorized Access" });
      })
      .then((response2) => {
        res.status(200).send({ success: "User Successfully Updated" });
      })

      .catch((err) => {
        res.status(404).send(err);
      });
  } catch (e) {
    res.send(e);
  }
};

const delete_user = async (req, res) => {
  const tokenID = decodeToken(req.headers.authorization.substr(7));
  if (tokenID === undefined) {
    res
      .status(401)
      .send({ error: "Unidentified User", message: "Invalid Token Passed" });
  }

  try {
    User.findById(tokenID)
      .then((response) => {
        console.log(
          {
            "id from database": mongoose.Types.ObjectId(response._id).toString()
          },
          { tokenID }
        );
        const UserID = mongoose.Types.ObjectId(response._id).toString();
        if (
          UserID === tokenID ||
          response.user_role === "admin" ||
          response.user_role === "superadmin"
        ) {
          return User.findByIdAndDelete(req.params.id);
        }

        res.status(401).send({ error: "Unauthorized Access" });
      })
      .then((response2) => {
        res.send({ success: "User Account Deleted Successfully" });
      })

      .catch((err) => {
        res.status(404).send(err);
      });
  } catch (e) {
    res.send(e);
  }
};

module.exports = {
  get_users,
  get_top_users,
  get_single_user,
  update_user,
  delete_user
};
