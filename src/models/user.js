const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    passWord: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        const validGenders = ["male", "female", "others"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error("Not a valid gender (Male, Female or Others)");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1740779693~exp=1740783293~hmac=3ffc11733917c931bddeec957e8fa649e6a1590282b3210d816ccbf54dab2e94&w=900",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
    },
    about: {
      type: String,
      default: "Dev is in search for someone",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEV@TINDER044", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.validatePassword = async function (passWordbyUser) {
  const user = this;
  const ispasswordValid = await bcrypt.compare(passWordbyUser, user.passWord);

  return ispasswordValid;
};

module.exports = mongoose.model("User", userSchema);

// Doing this for the first time
