const mongoose = require("mongoose");
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

    },
    passWord : {
        type : String,
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




module.exports = mongoose.model("User", userSchema);

