const ImageKit = require("imagekit");
const uuid = require("uuid");

const imagekit = new ImageKit({
  publicKey: "public_e5cs35YbhlFkCwLY3xvugmZSkXs=",
  privateKey: "private_ccuMYbinBva8q6tadUL35gky8ig=",
  urlEndpoint: "https://ik.imagekit.io/jwjlkphqy5y"
});

const get_auth = (req, res) => {
  try {
    const token = req.query.token || uuid.v4();
    const expiration =
      req.query.expire || parseInt(Date.now() / 1000) + 60 * 10; // Default expiration in 10 mins

    const signatureObj = imagekit.getAuthenticationParameters(
      token,
      expiration
    );

    res.status(200).send(signatureObj);
  } catch (err) {
    // console.error(
    //   "Error while responding to auth request:",
    //   JSON.stringify(err, undefined, 2)
    // );
    console.log(err)
    res.status(500).send("Internal Server Error");
  }
};

const delete_file = (req, res) => {
  imagekit.deleteFile(req.params.fileid, function (error, result) {
    if (error) {
      res.send({ message: "Error deleting image", error });
      console.log(error);
    } else {
      console.log(result);
      res.send({ message: "Image deleted successfully", result });
    }
  });
};

module.exports = {
  get_auth,
  delete_file
};
