const express = require("express");
const app = express();


// app.use("/",  (req,res)=>{
//     res.send("Hello World!");
// } )
app.use("/home",  (req,res)=>{
    res.send("Hello From the dashboard!");
} )
app.use("/test",  (req,res)=>{
    res.send("Everything is okey");
} )
app.use("/gateway",  (req,res)=>{
    res.send("Gateway of India is cool");
} )



app.listen(7777,()=>{
    console.log("Our Express Server is Running smoothly");
})          