const express = require('express');
const router  = express.Router();
const announcementController = require('../../controllers/announcementController');


router.get("/", announcementController.get_announcements)

// router.get("/search", announcementController.search_announcements)

router.get('/:slug', announcementController.get_single_announcement)

router.post("/", announcementController.create_announcement)

router.put('/:id', announcementController.update_announcement)

router.delete('/:id', announcementController.delete_announcement)

module.exports = router;