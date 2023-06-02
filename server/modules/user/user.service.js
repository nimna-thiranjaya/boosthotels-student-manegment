const User = require("./user.model");

const save = async (user, session) => {
  return await user.save({ session });
};

const find = async (obj) => {
  return await User.find(obj).sort({ updatedAt: -1 });
};

const findById = async (id, session) => {
  if (session) {
    return await User.findById(id).session(session);
  } else {
    return await User.findById(id);
  }
};

const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await User.findByIdAndDelete(id).session(session);
  } else {
    return await User.findByIdAndDelete(id);
  }
};

module.exports = {
  save,
  find,
  findById,
  findByIdAndDelete,
};
