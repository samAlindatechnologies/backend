const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  hash: {
    type: String,
    unique: true,
    required: true,
  },
  salt: {
    type: String,
    unique: true,
    required: true,
  },
  pseudo: {
    type: String,
    unique: true,
    required: true,
  },
});

mongoose.model("User", userSchema);
