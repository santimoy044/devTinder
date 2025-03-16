const express = require("express");
const userRouter = express.Router();
const  { userAuth } = require("../middlewares/auth");

const {ConnectionRequest} = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";


userRouter.get("/user/requests/interested", userAuth, async (req,res)=>{
    try{
         
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserid : loggedInUser._id,
            status : "interested",
        }).populate("fromUserid", "firstName lastName");

        if(connectionRequest.length === 0){
            res.send("Requests list is empty");
        }

        res.status(200).json({
            connectionRequest
        })

    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }
})

userRouter.get("/user/connections", userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserid : loggedInUser._id, status : "accepted"},
                {toUserid : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserid" ,USER_SAFE_DATA).populate("toUserid", USER_SAFE_DATA);
        if(connectionRequest.length === 0){
            res.send("Connections list is empty");
        }
        if(connectionRequest.length === 0){
            res.send("Connection list is empty");
        }
        const connections = connectionRequest.map(row => {
            if(row.fromUserid._id.toString()===loggedInUser._id.toString()){
                return row.toUserid
            }
            return row.fromUserid
            }
        )
        res.status(200).json({
            connections
        })
        
    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }

})

module.exports = {
    userRouter
}