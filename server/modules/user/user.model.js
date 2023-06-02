const mongoose = require("mongoose");
const constants = require("../../constants");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      maxlength: [200, "Full name cannot be more than 200 characters"],
    },

    imageUrl: {
      type: String,
      required: [true, "User picture is required!"],
    },

    university: {
      type: String,
    },

    studyYear: {
      type: String,
    },

    email: {
      type: String,
      unqiue: true,
      maxlength: [60, "Email cannot be more than 60 characters"],
      required: [true, "Email is required"],
      validate: {
        validator: (value) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: "Invalid email address!",
      },
    },

    role: {
      type: String,
      required: [true, "User role is required!"],
      enum: {
        values: [constants.USER.ROLES.ADMIN, constants.USER.ROLES.STUDENT],
        message: "Valid role is required!",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", UserSchema);
