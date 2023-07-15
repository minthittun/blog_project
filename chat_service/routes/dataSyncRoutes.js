const express = require('express');
const router = express.Router();
const dataSyncController = require('../controllers/dataSyncController');



router.post('/syncUserData', dataSyncController.syncUserData);
  

module.exports = router;
