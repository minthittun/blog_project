// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');
const {authenticateToken} = require('../middleware/authMiddleware')

router.get('/getall', authenticateToken, postController.getAllPost);
router.get('/users/:userId', authenticateToken, postController.getAllPostByUserId);
router.get('/getbyid/:id', authenticateToken, postController.getSinglePost);
router.post('/addnew', authenticateToken, upload.single("file"), postController.createPost);
router.put('/update/:id', authenticateToken, upload.single("file"), postController.updatePost);
router.delete('/deletepost/:id', authenticateToken, postController.deletePost);
router.get('/showPostPhoto', postController.showPostPhoto);

module.exports = router;
