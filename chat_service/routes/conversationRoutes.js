const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');



router.get('/all/:userId', conversationController.getConversationByUserId);
router.get('/messages/:conversationId', conversationController.getMessagesByConversationId);
router.get('/dummmy', conversationController.testApi);
  

module.exports = router;
