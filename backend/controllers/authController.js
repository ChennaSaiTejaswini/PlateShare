const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("📩 Incoming Signup Request:", req.body);

    const { name, email, password, phone, address, userType, charityName, registrationNumber, cause } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists!");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Password Hashed Successfully");

    // Prepare user data (exclude fields based on userType)
    let userData = {
      name, email, password: hashedPassword, phone, address, userType
    };

    if (userType === "charity") {
      userData.charityName = charityName;
      userData.registrationNumber = registrationNumber;
      userData.cause = cause;
    }

    // Create new user
    const user = new User(userData);

    await user.save();
    console.log("✅ User Saved Successfully in MongoDB");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("🚨 Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token (Optional)
    const token = jwt.sign({ userId: user._id, userType: user.userType }, "secretkey", { expiresIn: "1h" });

    res.json({ message: "Login successful",
       userType: user.userType,
        donorId: user._id, // Send donor ID
      donorEmail: user.email, // Send email
      token, });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
