// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticateToken} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware');


router.post('/register', userController.registerUser);
router.post('/update/:id', authenticateToken, userController.updateUser);
router.get('/showProfilePicture/:userId', userController.showProfilePicture);
router.post('/uploadProfilePictureOnly', upload.single("file"), userController.uploadProfilePictureOnly);
router.post('/login', userController.loginUser);
router.post('/refreshToken', userController.refreshToken);


module.exports = router;
