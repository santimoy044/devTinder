const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, email, passWord } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter a vaid first or last name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid Email ID");
  } else if (!validator.isStrongPassword(passWord)) {
    throw new Error("Enter a strong password");
  }
};
const validateUpdateFields = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "photoURL",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const receivedFields = Object.keys(req.body);

  // Check if all received fields are in the allowed list
  return receivedFields.every((field) => allowedFields.includes(field));
};

module.exports = { validateSignupData, validateUpdateFields };
