const express = require('express');
const router  = express.Router();
const uploadController = require('../../controllers/uploadController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/auth", uploadController.get_auth)

router.delete('/:fileid', tokenVerify, uploadController.delete_file)

module.exports = router;