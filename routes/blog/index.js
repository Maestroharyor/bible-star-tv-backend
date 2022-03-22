const express = require('express');
const router  = express.Router();
const blogController = require('../../controllers/blogController');
const {tokenVerify} = require('../../middlewares/tokenVerify');


router.get("/", blogController.get_blogs)

router.get("/search", blogController.search_blogs)

router.get('/:slug', blogController.get_single_blog)

router.post("/", tokenVerify, blogController.create_blog)

router.put('/:id', tokenVerify, blogController.update_blog)

router.delete('/:id', tokenVerify, blogController.delete_blog)

module.exports = router;