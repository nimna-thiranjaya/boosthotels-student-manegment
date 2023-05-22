const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("express-async-errors");

const commonConfig = require("./modules/common/common.config");
const errorHandlerMiddleware = require("./modules/error/error.middleware");
const NotFoundError = require("./modules/error/error.classes/NotFoundError");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  throw new NotFoundError("API endpoint not found!");
});

const start = async () => {
  const port = process.env.PORT || 5000;
  try {
    await commonConfig.databaseConnection();
    app.listen(port, () => {
      console.log(`SERVER IS LISTENING ON PORT ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
