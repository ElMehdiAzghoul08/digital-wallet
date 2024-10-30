const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Set both req.user and req.body.userId for compatibility
    req.user = { _id: decodedToken.userId };
    req.body.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "jwt expired",
      });
    }
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
