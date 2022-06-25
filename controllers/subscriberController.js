const mongoose = require("mongoose");
const User = require("../models/userModel");
const Subscriber = require("../models/subscriberModel");
const { paginated_result } = require("../middlewares/requestpaginate");
const { decodeToken } = require("../middlewares/tokenVerify");

module.exports.get_subscribers = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 12;
  const startIndex = (page - 1) * per_page;

  if (req.query.search) {
    try {
      const count = await Subscriber.count({
        title: { $regex: String(req.query.search) },
      });
      const query = await Subscriber.find({
        title: { $regex: String(req.query.search) },
      })
        .limit(per_page)
        .skip(startIndex);
      if (!query || query.length === 0) {
        res.status(400).send({ error: "Subscriber not found" });
      } else {
        res.send(paginated_result(page, per_page, count, query));
      }

      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    try {
      const count = await Subscriber.count();
      const query = await Subscriber.find().limit(per_page).skip(startIndex);
      res.send(paginated_result(page, per_page, count, query));
      // next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

module.exports.add_subscriber = async (req, res) => {
  if (req.body.name && req.body.phone_number) {
    Subscriber.create(req.body)
      .then((response) => {
        res.status(201).json(message: "Successfull", response);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } else {
    res.status(400).send({ message: "Please enter all fields" });
  }
};

module.exports.edit_subscriber = async (req, res) => {
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
            "id from database": mongoose.Types.ObjectId(
              response._id
            ).toString(),
          },
          { tokenID }
        );
        const UserID = mongoose.Types.ObjectId(response._id).toString();
        if (
          UserID === tokenID ||
          response.user_role === "admin" ||
          response.user_role === "superadmin"
        ) {
          return Subscriber.findByIdAndUpdate(req.params.id, req.body, {
            useFindAndModify: false,
          });
        }

        res.status(401).send({ error: "Unauthorized Access" });
      })
      .then((response2) => {
        res.status(200).send({ success: "Subscriber Successfully Updated" });
      })

      .catch((err) => {
        res.status(404).send(err);
      });
  } catch (e) {
    res.send(e);
  }
};

module.exports.delete_subscriber = async (req, res) => {
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
            return Subscriber.findByIdAndDelete(req.params.id);
          }
  
          res.status(401).send({ error: "Unauthorized Access" });
        })
        .then((response2) => {
          res.send({ success: "Subscriber detail Deleted Successfully" });
        })
  
        .catch((err) => {
          res.status(404).send(err);
        });
    } catch (e) {
      res.send(e);
    }
};
