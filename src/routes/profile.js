const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const {
  validateSignupData,
  validateUpdateFields,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "firstName lastName email photoURL about skills age gender"
    );
    res.json(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.post("/profile/update", userAuth, async (req, res) => {
  try {
    const isupdateAllowed = validateUpdateFields(req);
    if (!isupdateAllowed) {
      throw new Error("Invalid Field");
    }

    const loggedInUser = req.user;

    // Validate firstName if it's being updated
    if (req.body.firstName) {
      if (req.body.firstName.length < 2 || req.body.firstName.length > 20) {
        throw new Error("First name must be between 2 and 20 characters");
      }
    }

    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();
    res.json({
      message: "Profile Updated Successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = { profileRouter };
