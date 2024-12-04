const express = require("express");
const app = express();

const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/usersRoute");
const transactionsRoute = require("./routes/TransactionsRoute");

const requestsRoute = require("./routes/requestsRoute");

require("dotenv").config();
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/transactions", transactionsRoute);
app.use("/api/requests", requestsRoute);

const PORT = process.env.PORT || 5000;
const path = require("path");
// heroku

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
