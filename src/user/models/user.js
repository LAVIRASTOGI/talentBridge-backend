//user schema
const mongoose = require("mongoose");
var validator = require("validator");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
//create moongoose schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Type Strong Password :" + value);
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid" + value);
        }
      },
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    phoneNumber: {
      type: Number,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          // Validates that the number is a valid phone number
          // Assumes phone numbers are at least 10 digits
          return /^\d{10,}$/.test(v.toString());
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      unique: true,
    },
    //skills are array
    skills: {
      type: [String],
      default: [],
    },
    // photoUrl: {
    //   type: String,
    //   default:
    //     "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
    //   validate(value) {
    //     if (!validator.isURL(value)) {
    //       throw new Error("Url is not valid :" + value);
    //     }
    //   },
    // },
  },
  { timestamps: true }
);

//create Model - like a class
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "Lavi1993@",
    { expiresIn: "7d" }
  );
};
userSchema.methods.comparePassword = async function (passwordByInput) {
  return await bcrypt.compare(passwordByInput, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
