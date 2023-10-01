import mongoose from "mongoose";
import logger from "./logger";

export default function dbDisconnect() {
  logger.info("MongoDB connection closed due to app termination");
  mongoose.connection.close();
  process.exit(0);
}
