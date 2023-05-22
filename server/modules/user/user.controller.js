const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");
const userUtil = require("./user.util");
const User = require("./user.model");
const Auth = require("../auth/auth.model");
const AuthServices = require("../auth/auth.service");
const UserServices = require("./user.service");

//Import error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const NotFoundError = require("../error/error.classes/NotFoundError");

const CreateUser = async (req, res) => {
  const { password } = req.body;

  const user = new User(req.body);

  const userCheck = await Auth.findById(user.email);

  if (userCheck) {
    throw new BadRequestError("Email already exists!");
  }

  // validate password
  if (!password) {
    throw new BadRequestError("Password is required!");
  }

  //construct auth object
  const auth = new Auth();
  auth._id = user.email;
  auth.password = await userUtil.getEncryptedPassword(password);
  auth.user = user;

  //create user
  let createdUser = null;

  //start session
  const session = await startSession();

  try {
    session.startTransaction();

    //save user
    createdUser = await UserServices.save(user, session);

    //save auth
    await AuthServices.save(auth, session);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully!",
      data: createdUser,
    });
  } catch (err) {
    //abort transaction
    throw err;
  } finally {
    //end session
    session.endSession();
  }
};

//Get all Students
const GetAllStudents = async (req, res) => {
  try {
    const students = await UserServices.find({ role: "student" });

    return res.status(StatusCodes.OK).json({
      students,
    });
  } catch (err) {
    throw err;
  }
};

//Get user Profile
const GetUserProfile = async (req, res) => {
  const auth = req.auth;

  const user = await UserServices.findById(auth.id);

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  return res.status(StatusCodes.OK).json({
    user,
  });
};

//Delete user by id  (for admin)
const DeleteUserById = async (req, res) => {
  const userID = req.params.id;

  const user = await UserServices.findById(userID);

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  //start mongoose default session to handle transactions
  const session = await startSession();

  try {
    //start transaction
    session.startTransaction();

    //delete user profile
    await UserServices.findByIdAndDelete(userID, session);

    //delete auth
    await AuthServices.findByIdAndDelete(user.email, session);

    //commit transaction
    await session.commitTransaction();

    return res.status(StatusCodes.OK).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    //abort transaction
    await session.abortTransaction();
    throw err;
  } finally {
    //end session
    session.endSession();
  }
};

//Update user (for admin)
const UpdateUserById = async (req, res) => {
  const userID = req.params.id;
  const newUser = req.body;

  const user = await UserServices.findById(userID);

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  //start mongoose default session to handle transactions
  const session = await startSession();

  try {
    //start transaction
    session.startTransaction();

    // construct update user object
    user.fullName = newUser.fullName;
    user.university = newUser.university;
    user.studyYear = newUser.studyYear;
    user.imageUrl = newUser.imageUrl;

    //update user profile
    await UserServices.save(user, session);

    //commit transaction
    await session.commitTransaction();

    return res.status(StatusCodes.OK).json({
      message: "User updated successfully",
    });
  } catch (err) {
    //abort transaction
    await session.abortTransaction();
    throw err;
  } finally {
    //end session
    session.endSession();
  }
};

module.exports = {
  CreateUser,
  GetAllStudents,
  GetUserProfile,
  DeleteUserById,
  UpdateUserById,
};
