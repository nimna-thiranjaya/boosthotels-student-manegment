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

module.exports = {
  CreateUser,
};
