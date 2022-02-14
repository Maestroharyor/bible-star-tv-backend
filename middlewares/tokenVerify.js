const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

module.exports.tokenVerify = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.substr(7);

    jwt.verify(token, process.env.JWTSIGN, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(400).send({ error: "Invalid Token Gotten" });
      } else {
        const tokenID = decodedToken.id;
        User.findById(tokenID)
          .then((response) => {
            next();
          })
          .catch((err) => {
            res
              .status(401)
              .send({
                error: "Unidentified User",
                message: "Invalid Token Passed",
                err
              });
          });
        // console.log(decodedToken)
      }
    });
  } else {
    // console.log(req.headers)
    res.status(400).send({ error: "Unauthorized access detected!!!" });
  }
};

module.exports.decodeToken = (token) => {
  let validToken, error;
  jwt.verify(token, "Fovero21biblestar", (err, decodedToken) => {
    if (decodedToken !== undefined) {
      validToken = decodedToken.id;
    }
    error = err;
  });
  return validToken;
};
