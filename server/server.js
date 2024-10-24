const express = require("express");
const app = express();

const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/usersRoute");
const transactionsRoute = require("./routes/TransactionsRoute");

require("dotenv").config();
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
