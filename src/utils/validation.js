const validator = require("validator");
validateSignupData = (req) => {
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

module.exports = {validateSignupData};