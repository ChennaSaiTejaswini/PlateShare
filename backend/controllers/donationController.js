const Donation = require("../models/Donation");
const axios = require("axios");
const nodemailer = require("nodemailer"); // Import email package

exports.createDonation = async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, foodType, quantity, expiryDate, pickupLocation, gpsCoordinates } = req.body;

    // Ensure all required fields are provided
    if (!donorName || !donorEmail || !donorPhone || !foodType || !quantity || !expiryDate || !pickupLocation || !gpsCoordinates) {
      return res.status(400).json({ message: "All fields, including GPS coordinates, are required" });
    }

    // Ensure GPS coordinates are valid
    if (!gpsCoordinates.lat || !gpsCoordinates.lng) {
      return res.status(400).json({ message: "Invalid GPS coordinates" });
    }

    const newDonation = new Donation({
      donorName,
      donorEmail,
      donorPhone,
      foodType,
      quantity,
      expiryDate,
      pickupLocation,
      gpsCoordinates, // ✅ Now correctly saving GPS coordinates
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation created successfully", donation: newDonation });
  } catch (error) {
    res.status(500).json({ message: "Error creating donation", error });
  }
};



exports.getDonationsByDonor = async (req, res) => {
  try {
    const { email } = req.query; // Get email from request query

    if (!email) {
      return res.status(400).json({ message: "Donor email is required" });
    }

    const donations = await Donation.find({ donorEmail: email }); // Filter by donor email
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations", error });
  }
};





// Retrieve Past Donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }); // Fetch in descending order
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Fetch all pending donations for charity
exports.getPendingDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Pending" });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};



// Configure nodemailer (Use your email and app password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "official.plateshare@gmail.com", // 🔹 Replace with your email
    pass: "iuam ixwb xxwx tcyf" // 🔹 Use an App Password (Not your actual password)
  }
});
// Accept a donation






exports.acceptDonation = async (req, res) => {
  try {
    const { id } = req.params; // Donation ID
    const { charityEmail } = req.body; // Get accepting charity's email from frontend

    // Find the donation
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Update status to "Accepted" and store accepting charity's email
    donation.status = "Accepted";
    donation.acceptedBy = charityEmail; // Store which charity accepted it
    await donation.save();

    // Get donor email
    const donorEmail = donation.donorEmail; // Donor's email

    // Send an email notification to the donor
    const mailOptions = {
      from: '"PlateShare Team" <official.plateshare@gmail.com>',
      to: donorEmail,
      subject: "Your Donation Has Been Accepted!",
      text: `Hello ${donation.donorName},\n\nYour donation of ${donation.foodType} has been accepted by a charity. Thank you for your generosity!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Donation accepted, but email failed to send" });
      }
      return res.status(200).json({ message: "Donation accepted and email sent successfully!" });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update donation status to "Collected"
exports.markAsCollected = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findByIdAndUpdate(
      id,
      { status: "Collected" },
      { new: true } // Return updated document
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ message: "Donation marked as collected", donation });
  } catch (error) {
    res.status(500).json({ message: "Error updating donation", error });
  }
};




// Update donation status
exports.updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const donation = await Donation.findById(id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  donation.status = req.body.status;
  await donation.save();
  res.status(200).json({ message: "Updated", donation });
};


exports.markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation || donation.status !== "accepted") {
      return res.status(400).json({ message: "Donation not found or not accepted yet" });
    }

    donation.status = "delivered"; 
    await donation.save();

    res.json({ message: "Donation marked as delivered!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




