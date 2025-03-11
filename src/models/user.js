const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        minLength : 3,
        maxLength : 20,
    },
    lastName : {
        type: String,

    },
    email : {
        type: String,
        required : true,
        unique : true, 
        match: /.+\@.+\..+/ , 
        lowercase : true,
        trim : true,
        validate(value){

           if(!validator.isEmail(value)) {
            throw new Error("Invalid Email Address");
           }
        }

    },
    passWord : {
        type : String,
        required : true,
    },
    age : {
        type: Number,
        min : 18,
        max : 60,
    },
    gender : {
    type: String,
    required : true,
    trim : true,
    validate(value){
        if(!["male", "female", "others"].includes(value)){
            throw new Error ("Not a valid gender (Male , Female and other)");
        }
    }
    }, 
    about :{
        type : String,
        default : "Dev is in search for someone",
    }, 
    skills : {
        type : [String],
    }

    
},  
{

    timestamps : true
}
);

userSchema.methods.getJWT = async function () {

    const user = this;
    const token = jwt.sign({_id:user._id},"DEV@TINDER044", {expiresIn : "7d"});
    return token;
}

userSchema.methods.validatePassword = async function(passWordbyUser){
    const user = this;
    const ispasswordValid = await bcrypt.compare(passWordbyUser,user.passWord);
    
    return ispasswordValid ;
}


module.exports = mongoose.model("User", userSchema);

