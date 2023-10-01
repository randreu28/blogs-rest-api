import mongoose from "mongoose";
import express from "express";
import config from "./config";
import logger from "./logger";
import dbDisconnect from "./dbDisconnect";

export function dbConnect(app: express.Express) {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(config.URI)
    .then(() => {
      logger.info(`Server initialized in ${config.ENV} mode`);
      logger.info("Connected to MongoDB");
      app.listen(config.PORT, () => {
        logger.info(`Server running  at http://localhost:${config.PORT}`);
      });
    })
    .catch(() => {
      logger.error("Error connecting to db");
    });

  process.on("SIGINT", dbDisconnect).on("SIGTERM", dbDisconnect);
}
