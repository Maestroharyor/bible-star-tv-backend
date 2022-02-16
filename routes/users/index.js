const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/userController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/", userController.get_users)

router.get("/batch/:id", userController.get_batch_users)

router.get("/top", userController.get_top_users)

router.get('/:id', userController.get_single_user)

router.put('/:id', userController.update_user)

router.delete('/:id', userController.delete_user)

module.exports = router;