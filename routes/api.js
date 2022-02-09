const express = require('express');
const router = express.Router();
const userRouter = require('./users/index');
const authRouter = require('./auth/index');
const auditionRouter = require('./audition/index');
const statsRouter = require('./stats/index');
const blogRouter = require('./blog/index');
const {tokenVerify} = require('../middlewares/tokenVerify');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/blogs', blogRouter);
router.use('/auditions', tokenVerify, auditionRouter);
router.use('/stats', tokenVerify, statsRouter);
module.exports = router;