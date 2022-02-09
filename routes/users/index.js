const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/userController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/", userController.get_users)

router.get('/:id', userController.get_single_user)

router.put('/:id', userController.update_user)

router.delete('/:id', userController.delete_user)

module.exports = router;