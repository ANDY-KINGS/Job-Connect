import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("TOKEN RECEIVED:", token ? "YES" : "NO");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DECODED ID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("USER NOT FOUND IN DB FOR ID:", decoded.id);
        return res.status(401).json({ message: "Not authorized - user not found" });
      }

      console.log("USER AUTHENTICATED:", req.user.email, "ROLE:", req.user.role);
      return next();
    } catch (error) {
      console.error("JWT ERROR:", error.message);
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    console.log("NO TOKEN PROVIDED IN HEADERS");
    return res.status(401).json({ message: "No token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("AUTHORIZE FAILED: req.user missing");
      return res.status(401).json({ message: "Not authorized" });
    }
    if (!roles.includes(req.user.role)) {
      console.log(`ROLE DENIED. Required: [${roles}], Actual: ${req.user.role}`);
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};

export { protect, authorize };
