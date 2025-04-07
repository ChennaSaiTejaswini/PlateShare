const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.post("/send-email", NotificationController.sendDonationAcceptedEmail);

module.exports = router;
