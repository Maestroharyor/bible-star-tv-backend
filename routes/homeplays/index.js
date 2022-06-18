const express = require('express');
const router  = express.Router();
const homePlayController = require('../../controllers/homePlayController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/", homePlayController.get_all_homeplays)

router.post("/", homePlayController.add_homeplay)

router.post("/answer/:id", homePlayController.answer_homeplay)

router.put('/:id', homePlayController.update_homeplay)

router.delete('/:id', homePlayController.delete_homeplay)

module.exports = router;