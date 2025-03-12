const express = require("express");
const userRouter = express.Router();
const  { userAuth } = require("../middlewares/auth");

const {ConnectionRequest} = require("../models/connectionRequest");


userRouter.get("/user/requests/interested", userAuth, async (req,res)=>{
    try{
         
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserid : loggedInUser._id,
            status : "interested",
        })

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

module.exports = {
    userRouter
}