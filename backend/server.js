const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyparser=require('body-parser');
const donationRoutes = require("./routes/donationRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();





const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyparser.json())
app.use(express.json());


app.use("/api", require("./routes/authRoutes"));
app.use("/api", donationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
