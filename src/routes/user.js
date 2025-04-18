const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const { ConnectionRequest } = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";

userRouter.get("/user/requests/interested", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserid: loggedInUser._id,
      status: "interested",
    }).populate({
      path: "fromUserid",
      select: USER_SAFE_DATA,
    });

    if (connectionRequest.length === 0) {
      res.send("Requests list is empty");
    }

    res.status(200).json({
      connectionRequest,
    });
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserid: loggedInUser._id, status: "accepted" },
        { toUserid: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate({
        path: "fromUserid",
        select: USER_SAFE_DATA,
      })
      .populate({
        path: "toUserid",
        select: USER_SAFE_DATA,
      });
    if (connectionRequest.length === 0) {
      res.send("Connections list is empty");
    }
    if (connectionRequest.length === 0) {
      res.send("Connection list is empty");
    }
    const connections = connectionRequest.map((row) => {
      if (row.fromUserid._id.toString() === loggedInUser._id.toString()) {
        return row.toUserid;
      }
      return row.fromUserid;
    });
    res.status(200).json({
      connections,
    });
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 50;
    const showAll = req.query.showAll === "true";
    limit = showAll ? 1000 : limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserid: loggedInUser._id }, { toUserid: loggedInUser._id }],
    }).select("fromUserid toUserid status");
    const hideUserfromfeed = new Set();
    connectionRequest.forEach((row) => {
      hideUserfromfeed.add(row.fromUserid.toString());
      hideUserfromfeed.add(row.toUserid.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserfromfeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    if (users.length === 0) {
      return res.send("No users found for the feed.");
    }

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(users.length / limit),
        totalUsers: users.length,
        hasMore: users.length === limit,
      },
    });
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
});

module.exports = {
  userRouter,
};
