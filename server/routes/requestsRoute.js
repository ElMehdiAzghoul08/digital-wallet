const router = require("express").Router();
const Request = require("../models/requestsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const Transaction = require("../models/TransactionsModel");

router.get("/get-all-requests-by-user", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
      message: "Requests fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    w <
      res.status(500).json({
        success: false,
        message: error.message || "Error fetching requests",
      });
  }
});

router.post("/send-request", authMiddleware, async (req, res) => {
  try {
    const { receiver, amount, description } = req.body;

    // Detailed validation
    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver account is required",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // Convert amount to number if it's a string
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Create new request using req.user._id for sender
    const newRequest = new Request({
      sender: req.user._id,
      receiver,
      amount: numericAmount,
      description,
    });

    const request = await newRequest.save();
    await request.populate("sender receiver");

    res.status(200).json({
      data: request,
      success: true,
      message: "Request sent successfully",
    });
  } catch (error) {
    console.error("Send request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error processing request",
    });
  }
});

// update a request status

router.post("/update-request-status", authMiddleware, async (req, res) => {
  try {
    if (req.body.status === "accepted") {
      // create transaction
      const transaction = new Transaction({
        sender: req.body.sender._id,
        receiver: req.body.receiver._id,
        amount: req.body.amount,
        reference: req.body.description,
        status: "success",
        type: "request",
      });

      await transaction.save();

      // take amount from sender
      await User.findByIdAndUpdate(req.body.sender._id, {
        $inc: { balance: req.body.amount },
      });

      // add amount to receiver
      await User.findByIdAndUpdate(req.body.receiver._id, {
        $inc: { balance: -req.body.amount },
      });
    }
    await Request.findByIdAndUpdate(req.body._id, {
      status: req.body.status,
    });

    res.send({
      data: null,
      message: "Request status updated successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      data: error,
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
