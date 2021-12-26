const express = require('express');
const router  = express.Router();
const authController = require('../../controllers/authController')

router.post('/signup', authController.auth_signup)

router.post('/login', authController.auth_login)

router.post('/reset-password', authController.auth_password_reset)

router.post('/reset-password/:token', authController.auth_password_reset_token)

router.post('/set-password', authController.auth_set_password)

module.exports = router;