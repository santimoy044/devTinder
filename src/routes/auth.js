const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, email, passWord, gender } = req.body;
    const passwordHash = await bcrypt.hash(passWord, 10);

    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      throw new Error("Email already exists");
    }

    const user = new User({
      firstName,
      lastName,
      email,
      gender,
      passWord: passwordHash,
    });

    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(404).send(`error saving the use ${err.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, passWord } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Address");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const ispasswordValid = await user.validatePassword(passWord);
    if (ispasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      // res.send("Login Successfull");
      res.json({
        message: `${user.firstName} logged in successfully`,
        user,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Successfull");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = {
  authRouter,
};
