const router = require("express").Router();
const Transaction = require("../models/TransactionsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
module.exports = router;

// transfer money from one account to another account

router.post("/transfer-fund", authMiddleware, async (req, res) => {
  try {
    // save transaction amount
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    // decrease the sender balance amount
    await User.findByIdAndUpdate(req.body.sender, {
      $inc: { balance: -req.body.amount },
    });
    // increase the receiver balance amount
    await User.findByIdAndUpdate(req.body.receiver, {
      $inc: { balance: req.body.amount },
    });
    res.send({
      message: "Transaction successful",
      data: newTransaction,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in transaction",
      data: error.message,
    });
  }
});

//verification of the receiver account by userId

router.post("/verify-account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.receiver);
    if (user) {
      return res.send({
        success: true,
        message: "Account verified successfully",
        data: user,
      });
    } else {
      return res.send({
        success: false,
        message: "Account not found",
        data: null,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "Error verifying account",
      data: error.message,
    });
  }
});

// get all transactions for a specific user

router.post(
  "/get-all-transactions-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const transactions = await Transaction.find({
        $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
      });
      res.send({
        data: transactions,
        success: true,
        message: "Transactions fetched successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: "Error fetching transactions",
        data: error.message,
      });
    }
  }
);

module.exports = router;
