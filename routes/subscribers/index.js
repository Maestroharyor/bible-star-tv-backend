const express = require('express');
const router  = express.Router();
const subscriberController = require('../../controllers/subscriberController');


router.get("/", subscriberController.get_subscribers)

router.post("/", subscriberController.add_subscriber)

router.put('/:id', subscriberController.edit_subscriber)

router.delete('/:id', subscriberController.delete_subscriber)

module.exports = router;