const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;
