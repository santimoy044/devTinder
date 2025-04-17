const express = require("express");

const app = express();

const connectDB = require("./config/database");

const {
  validateSignupData,
  validateUpdateFields,
} = require("./utils/validation");

const cookieParser = require("cookie-parser");

const User = require("./models/user.js");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { userAuth } = require("./middlewares/auth");

const { authRouter } = require("./routes/auth");

const { profileRouter } = require("./routes/profile");

const { requestRouter } = require("./routes/request");

const { userRouter } = require("./routes/user");

const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from React frontend
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", requestRouter);

app.use("/", userRouter);
app.use("/", profileRouter);

connectDB()
  .then(() => {
    console.log("Database Connection Successful");

    app.listen(process.env.PORT, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log("Database Connection failed");
  });
