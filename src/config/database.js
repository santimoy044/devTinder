const mongoose = require("mongoose");

/// emailID = santimoyrana044@gmail.com

const URI = "mongodb+srv://santimoyrana044:talda721435@namaste.aocq4.mongodb.net/devTinder"

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://santimoyrana044:talda721435@namaste.aocq4.mongodb.net/devTinder");
} ;



module.exports = connectDB; 