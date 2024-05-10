const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Please provide a name!"],
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: "string",
    required: [true, "Please provide a email!"],
    validate: {
      validator: function (v) {
        // Regular expression for email validation
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
    unique: [true, "Email already exists, Please try with another email!"],
  },
  password: {
    type: "string",
    required: [true, "Please provide password!"],
    minLength: 6,
  },
});

// mongoose middleware
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// instance method
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LEFTTIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
