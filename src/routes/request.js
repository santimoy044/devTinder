const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:toUserid", userAuth, async (req, res) => {
    try {
        const fromUser = req.user;
        const fromUserid = fromUser._id;

        const status = req.params.status;
        const toUserid = req.params.toUserid;

        // Fetch the recipient user
        const toUser = await User.findById(toUserid);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const allowedStatus = ["ignored", "intrested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({$or : [
            {fromUserid, toUserid},
            {fromUserid : toUserid, toUserid : fromUserid}
        ]})

        if(existingConnectionRequest){
            return res.status(400).json({message : "Request already exists"});
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserid,
            toUserid,
            status,
        });

        await connectionRequest.save();

        res.status(200).json({
            message: `${status} request sent to ${toUser.firstName} from ${fromUser.firstName}`,
            connectionRequest
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = requestRouter;