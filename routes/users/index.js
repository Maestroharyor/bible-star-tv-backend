const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/userController');
const {tokenVerify} = require('../../middlewares/tokenVerify');
const {upload} = require("../../middlewares/multerConfig")


router.get("/", userController.get_users)

router.get("/batch/:id", userController.get_batch_users)

router.get("/top", userController.get_top_users)

router.get('/:id', userController.get_single_user)

router.put('/:id', tokenVerify, userController.update_user)

// router.post('/:id/upload-profile', upload('file'), userController.upload_profile_picture)

router.delete('/:id', tokenVerify, userController.delete_user)

module.exports = router;