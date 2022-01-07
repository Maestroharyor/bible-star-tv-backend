const express = require('express');
const router = express.Router();
const userRouter = require('./users/index');
const authRouter = require('./auth/index');
const {tokenVerify} = require('../middlewares/tokenVerify');


router.use('/users', tokenVerify, userRouter);
router.use('/auth', authRouter);
module.exports = router;