const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// Register User
router.post("/register", async (req, res) => {
  try {
    // checking if the user exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "User registered successfully",
      data: null,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    // check if the user exists already
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    //check if password is correct
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    // generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Send the token
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Get user information
router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.password = "";
    res.send({
      message: "User info fetch success",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// Refresh Token Endpoint
router.post("/refresh-token", (req, res) => {
  const oldToken = req.body.token;

  try {
    const decodedToken = jwt.verify(oldToken, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    const newToken = jwt.sign(
      { userId: decodedToken.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: newToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
