const User = require("../models/User");
const Donation = require("../models/Donation");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Just send array directly
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("donorId", "name email");
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
};
