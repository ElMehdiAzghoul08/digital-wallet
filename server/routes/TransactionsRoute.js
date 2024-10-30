const router = require("express").Router();
const Transaction = require("../models/TransactionsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(process.env.stripe_key);

// transfer money from one account to another account

router.post("/transfer-fund", authMiddleware, async (req, res) => {
  try {
    // save transaction amount
    const newTransaction = new Transaction({
      ...req.body,
      type: "transfer", // Add this line
      status: "success", // Add this if not already included
      reference: "transfer", // Add this if not already included
    });
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
      })
        .populate("sender") // Add these populate calls
        .populate("receiver");

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

// deposing funds using stripe
router.post("/deposit-funds", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;

    // creating customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // creating charges
    const charges = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "usd",
        description: "Deposit to your digital wallet",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    // saving transactions
    if (charges.status === "succeeded") {
      const newTransaction = new Transaction({
        sender: req.body.userId,
        receiver: req.body.userId,
        amount: amount,
        type: "deposit",
        status: "success",
        reference: "stripe deposit",
        transactionId: charges.id,
      });
      await newTransaction.save();

      // increasing user balance
      await User.findByIdAndUpdate(req.body.userId, {
        $inc: { balance: amount },
      });

      res.send({
        success: true,
        message: "Transaction successful",
        data: charges,
      });
    } else {
      res.send({
        success: false,
        message: "Transaction failed",
        data: charges,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message || "Transaction failed",
      data: null,
    });
  }
});

module.exports = router;
