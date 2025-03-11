const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const isupdateAllowed = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
} ) ;

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
    try {
        if (!isupdateAllowed) {
            throw new Error("Invalid Field");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((field)=>{
            loggedInUser[field] = req.body[field];
        })

        await loggedInUser.save();
        res.json({
            message: "Profile Updated Successfully",
            data: loggedInUser
        })
    }




     catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
} ) ;

module.exports = { profileRouter };