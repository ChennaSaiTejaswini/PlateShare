const express = require("express");
const { getAllUsers, getAllDonations } = require("../controllers/adminController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", authenticate, isAdmin, getAllUsers);
router.get("/donations", authenticate, isAdmin, getAllDonations);

module.exports = router;
