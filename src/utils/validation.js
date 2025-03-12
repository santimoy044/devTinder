const validator = require("validator");
const validateSignupData = (req) => {
    const { firstName, lastName, email, passWord } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Enter a vaid first or last name") ;
    }

    else if(!validator.isEmail(email)){
        throw new Error("Enter a valid Email ID") ;
    }

    else if(!validator.isStrongPassword(passWord)){
        throw new Error("Enter a strong password") ;

              
    }

}

const validateUpdateFields = (req) => {
    const allowedFields = ["firstName", "lastName", "passWord","skills","about"];
    const isupdateAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
}
module.exports = {validateSignupData, validateUpdateFields};

