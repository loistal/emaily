const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String
});

// create users 
mongoose.model("users", userSchema);
