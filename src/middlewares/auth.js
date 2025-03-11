
const jwt = require("jsonwebtoken");

const User = require("../models/user"); 
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Please Log In");
        }

        // Verify JWT token
        const decodedObj = await jwt.verify(token, "DEV@TINDER044");

        // Extract _id from decoded object
        const { _id } = decodedObj;

        // Find user by ID
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware
    } 
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
};




module.exports = {
    
    userAuth,
}