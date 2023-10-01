import mongoose from "mongoose";
import express from "express";
import config from "./config";
import logger from "./logger";

export function dbConnect(app: express.Express) {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      `mongodb+srv://${config.DB_USERNAME}:${config.DB_PASSWORD}@fullstackopencluster.zgr0jwp.mongodb.net/blogs?retryWrites=true&w=majority`
    )
    .then(() => {
      logger.info("Connected to MongoDB");
      app.listen(config.PORT, () => {
        logger.info(`Server running at http://localhost:${config.PORT}`);
      });
    })
    .catch(() => {
      logger.error("Error connecting to db");
    });

  process.on("SIGINT", closeConnection).on("SIGTERM", closeConnection);

  function closeConnection() {
    logger.info("MongoDB connection closed due to app termination");
    mongoose.connection.close();
    process.exit(0);
  }
}
