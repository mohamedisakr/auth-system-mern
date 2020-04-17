const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// connect to database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// app middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors());    // allows all origins
// TODO: COMMENT
if ((process.env.NODE_DEV = "development")) {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` })); // http://localhost:3000
}

// route middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_DEV}`);
});
