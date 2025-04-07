const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: {type:String, required:true},
  donorPhone: {type:String, required:true},
  foodType: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  gpsCoordinates: { lat: Number, lon: Number },
  status: { type: String,
    enum: ["Pending", "Accepted", "Collected"],
     default: "Pending" }, // Default status is "Pending"
  createdAt: { type: Date, default: Date.now },
  acceptedBy: { type: String, default: null }, // Store the accepting charity's email
});

module.exports = mongoose.model("Donation", donationSchema);
