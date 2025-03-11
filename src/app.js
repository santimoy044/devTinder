const express = require("express");

const app = express();



const connectDB =require("./config/database")

const {validateSignupData} = require("./utils/validation")

const cookieParser = require("cookie-parser")

const User = require("./models/user.js");

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken'); 

const {userAuth} = require("./middlewares/auth");

const {authRouter} = require("./routes/auth");

const {profileRouter} = require("./routes/profile");




connectDB().then(()=>{
    console.log("Database Connection Successfull");
    
    app.listen(7777, () => {
        console.log("Server is running on port 7777");
    });

}).catch(err =>{
    console.log("Database Connection failed");
}

)


app.use(express.json()) ;  
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);



app.get("/profile", userAuth, async (req,res)=>{

    try{

        const user = req.user;
        res.send(user);
    }

    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})








