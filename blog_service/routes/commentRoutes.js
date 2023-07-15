const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const {authenticateToken} = require('../middleware/authMiddleware')


router.get('/posts/:postId', authenticateToken, commentController.getComment);
router.post('/', authenticateToken, commentController.createComment);
router.put('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);

module.exports = router;
