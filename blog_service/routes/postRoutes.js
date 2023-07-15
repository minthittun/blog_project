// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {authenticateToken} = require('../middleware/authMiddleware')

router.get('/', authenticateToken, postController.getAllPost);
router.post('/', authenticateToken, postController.createPost);
router.put('/:id', authenticateToken, postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);

module.exports = router;
