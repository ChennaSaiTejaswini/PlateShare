const express = require("express");
const { 
  createDonation, 
  getDonations, 
  getPendingDonations, 
  acceptDonation, 
  updateDonationStatus ,
  getDonationsByDonor,
  markAsCollected
} = require("../controllers/donationController");



const router = express.Router();

router.post("/donations", createDonation);
router.get("/donations", getDonations);
router.get("/pending", getPendingDonations);
router.put("/:id/accept", acceptDonation); // Accept donation (with email notification)
router.put("/:id", updateDonationStatus);

router.get("/donations-by-donor", getDonationsByDonor); 
router.put("/:id/collect", markAsCollected);

module.exports = router;
