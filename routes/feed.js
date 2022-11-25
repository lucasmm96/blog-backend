const express = require('express');
const { check } = require('express-validator');
const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post',[
  check('title')
    .trim()
    .isLength({ min: 5 }),
  check('content')
    .trim()
    .isLength({ min: 5 })
],feedController.createPost);

router.get('/post/:postId', feedController.getPost);

router.put('/post/:postId',[
  check('title')
    .trim()
    .isLength({ min: 5 }),
  check('content')
    .trim()
    .isLength({ min: 5 })
]);

module.exports = router;