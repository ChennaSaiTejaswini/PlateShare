const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  userType: { type: String, enum: ["donor", "charity", "admin"], required: true }, // ✅ Added "volunteer"
  charityName: String,
  registrationNumber: String,
  cause: String,
});

module.exports = mongoose.model("User", UserSchema);
