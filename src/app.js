const express = require("express");

const app = express();



const connectDB =require("./config/database")

const {adminAuth, userAuth} = require("./middlewares/auth.js")


connectDB().then(()=>{
    console.log("Database Connection Successfull");
    
    app.listen(7777, () => {
        console.log("Server is running on port 7777");
    });

}).catch(err =>{
    console.log("Database Connection failed");
}

)


const User = require("./models/user.js");

app.use(express.json()) ;  


app.post("/signup", async (req,res)=>{

   

    const user = new User(req.body);

    try{

        await user.save()
        res.send("User added Successfully");
    }
    catch(err){
        res.status(404).send(`error saving the use ${err.message}`);
    }

})

app.get("/user", async(req,res)=>{

    try{
        

        const userEmail = req.body.email;
        const user = await User.find({email:userEmail});
        if(user.length===0){
            res.status(404).send("Email not matched");
        }
        else{

            res.send(user);
        }
        
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
})

app.get("/feed", async(req,res)=>{

    try{
        

        
        const users = await User.find({});
        res.send(users);
        
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
})

app.delete("/user", async (req,res)=>{
    const userID = req.body.userID;

    try{
        const user =  await User.findByIdAndDelete(userID);
        res.send("User deleted Successfully")
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user/:id", async (req, res) => {
    try {
        const userID = req.params.id;
        const data = req.body;

        const ALLOWED_UPDATES = [
            "photoURL",
            "about",
            "gender",
            "skills",
            "firstName",
            "lastName",
            "age",
            
        ];
        
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }

        const user = await User.findByIdAndUpdate(
            userID,
            data,
            { returnDocument: "before", runValidators: true } // Corrected options
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

         res.send("User Updated")
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});






