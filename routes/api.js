const express = require('express');
const router = express.Router();
const brandRouter = require('./brands/index');
const paletteRouter = require('./palettes/index');
const gradientRouter = require('./gradients/index');
const userRouter = require('./users/index');
const authRouter = require('./auth/index');
const {tokenVerify} = require('../middlewares/tokenVerify');

router.use('/brands', brandRouter);
router.use('/palettes', paletteRouter);
router.use('/gradients', gradientRouter);
router.use('/users', tokenVerify, userRouter);
router.use('/auth', authRouter);
module.exports = router;