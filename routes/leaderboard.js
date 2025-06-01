
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const leaderboardController = require('../controller/leaderboardController');


router.get(
  '/leaderboard',
  authenticateUser,
  leaderboardController.getLeaderboard
);

module.exports = router;
