const express = require("express");
const router = express.Router();
const {
  handleGoogleLogin,
  handleGoogleCallback,
  getUserGoogleInfo,
  refreshAccessToken,
} = require("../controllers/oAuthControllers");

router.post("/google", handleGoogleLogin);
router.get("/google/callback", handleGoogleCallback);
router.get("/google/getUserInfo", getUserGoogleInfo);
router.get("/refresh-access-token", refreshAccessToken);

module.exports = router;
