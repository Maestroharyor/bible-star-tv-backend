const express = require('express');
const router  = express.Router();
const statsController = require('../../controllers/statsController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/funds", statsController.get_all_funds)

router.get("/audition", statsController.get_all_audition_funds)

router.get("/voting", statsController.get_all_voting_funds)

router.get("/funds/:id", statsController.get_single_funds)

router.post("/funds", statsController.add_funds)

router.put("/funds/:id", statsController.edit_single_funds)

router.delete("/funds/:id", statsController.delete_single_funds)



module.exports = router;