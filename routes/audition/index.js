const express = require('express');
const router  = express.Router();
const auditionController = require('../../controllers/auditionController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/", auditionController.get_all_auditions)

router.get("/questions", auditionController.audition)

router.post("/questions", auditionController.add_audition)

router.post("/answer/:id", auditionController.answer_audition)

router.get('/:id', auditionController.get_single_audition)

router.put('/:id', auditionController.update_audition)

router.delete('/:id', auditionController.delete_audition)

module.exports = router;