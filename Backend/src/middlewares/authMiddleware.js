import "dotenv/config";
import jwt from "jsonwebtoken";

const authentication = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    console.log("Authenticated user:", req.user); 
    next();
  } catch (error) {
    if ((error.name === "TokenExpiredError")) {
      return res.status(401).json({ message: "Access token expired" });
    }
    res.status(403).json({ message: "Invalid token." });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

export { authentication , authorizeRoles };
