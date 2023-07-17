const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const phonebookRouter = require("./controllers/phonebook");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// eslint-disable-next-line no-undef
const url = config.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    // eslint-disable-next-line quotes
    logger.info(`Successfully connected to Mongo DB`);
  })
  .catch((error) => {
    logger.error(error);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/people", phonebookRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
