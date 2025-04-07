const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey"); // Use env variable in real apps
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }
  next();
};
