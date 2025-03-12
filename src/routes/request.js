const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const {ConnectionRequest} = require("../models/connectionRequest");


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


        const allowedStatus = ["ignored", "interested"];
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

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const requestId = req.params.requestId;
        const loggedinUser = req.user;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid status"});
        }

        const connectionRequest = await ConnectionRequest.findById({
            _id : requestId,
            toUserid : loggedinUser._id,
            status : "interested"
        });
        if(!connectionRequest){
            return res.status(404).json({message : "Invalid request"});
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({
            message : `Connection Status is ${status}`,
            connectionRequest,
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }
)


module.exports = {requestRouter};