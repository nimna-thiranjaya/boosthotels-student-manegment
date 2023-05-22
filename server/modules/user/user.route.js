const express = require("express");
const userController = require("./user.controller");
const constants = require("../../constants");

const UserRouter = express.Router();

UserRouter.post("/register", userController.CreateUser);

module.exports = UserRouter;
