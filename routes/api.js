const express = require('express');
const router = express.Router();
const userRouter = require('./users/index');
const authRouter = require('./auth/index');
const auditionRouter = require('./audition/index');
const statsRouter = require('./stats/index');
const blogRouter = require('./blog/index');
const announcementRouter = require('./announcements/index');
const voteRouter = require('./votes/index');
const {tokenVerify} = require('../middlewares/tokenVerify');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/blogs', blogRouter);
router.use('/auditions', tokenVerify, auditionRouter);
router.use('/stats', tokenVerify, statsRouter);
router.use('/announcements', tokenVerify, announcementRouter);
router.use('/votes', tokenVerify, voteRouter);
module.exports = router;