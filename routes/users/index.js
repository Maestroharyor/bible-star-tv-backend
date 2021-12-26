const express = require('express');
const router  = express.Router();
const userController = require('../../controllers/userController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get('/brands', userController.get_brands)

router.get('/palettes', userController.get_palettes)

router.get('/gradients', userController.get_gradients)

router.get('/fonts', userController.get_fonts)

router.get('/:id', userController.get_user)

router.put('/:id', userController.update_user)

router.delete('/:id', userController.delete_user)

module.exports = router;