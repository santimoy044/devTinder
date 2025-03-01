const express = require("express");
const app = express();


// app.use("/",  (req,res)=>{
//     res.send("Hello World!");
// } )
// app.use("/home",  (req,res)=>{
    
// } )
// app.get("/user/:id",  (req,res)=>{
//     const id = req.params.id;
//     res.send(`User id : ${id}`);
// } )
app.get("/user",  (req,res)=>{
    const name = req.query.name ;
    console.log(name);
    res.send(`User name is ${name} `);
} )
app.delete("/user",  (req,res)=>{
    res.send("Deleted Successfully");
} )



app.listen(7777,()=>{
    console.log("Our Express Server is Running smoothly");
})          