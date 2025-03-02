const express = require("express");
const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth.js")


app.get("/admin/getUserdata", adminAuth, (req, res) => {  // Changed app.use() to app.get()
    console.log("Getting user data");
    res.send("User data retrieved successfully");  // Added response
});

app.delete("/admin/deleteUser", adminAuth, (req, res) => {  // Changed app.use() to app.delete()
    console.log("User deleted");
    res.send("User deleted successfully");  // Fixed undefined variable
});

app.post("/user/login", (req,res)=>{
    console.log("Login Successfull");
})
app.get("/user/getdata", userAuth, (req,res)=>{
    res.send("User data is okay");
})


// Start the server
app.listen(7777, () => {
    console.log("Server is running on port 7777");
});
