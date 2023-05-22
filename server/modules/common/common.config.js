const mongoose = require("mongoose");

const databaseConnection = async () => {
  let mongodbUrl = process.env.MONGODB_URI;

  mongoose.set("strictQuery", true);

  mongoose
    .connect(mongodbUrl)
    .then(() => {
      console.log("DATABASE CONNECTED..!!");
    })
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = {
  databaseConnection,
};
