const express = require("express");
const userController = require("./user.controller");
const authMiddleware = require("../auth/auth.middleware");

const constants = require("../../constants");

const UserRouter = express.Router();

UserRouter.post("/register", userController.CreateUser);

UserRouter.get(
  "/getAllUsers",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  userController.GetAllStudents
);

UserRouter.get(
  "/profile",
  authMiddleware.authorize([
    constants.USER.ROLES.STUDENT,
    constants.USER.ROLES.ADMIN,
  ]),
  userController.GetUserProfile
);

UserRouter.delete(
  "/delete/:id",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  userController.DeleteUserById
);

UserRouter.patch(
  "/updateUser/:id",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  userController.UpdateUserById
);
module.exports = UserRouter;
