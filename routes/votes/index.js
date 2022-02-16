const express = require('express');
const router  = express.Router();
const voteController = require('../../controllers/voteController');


router.get("/", voteController.get_votes)

router.get('/:id', voteController.get_single_vote)

router.post('/:userID', voteController.create_vote)

router.put('/:id', voteController.update_vote)

router.delete('/:id', voteController.delete_vote)

module.exports = router;