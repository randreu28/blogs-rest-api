import type { Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import config from "./utils/config";
import logger from "./utils/logger";
import middleware from "./utils/middleware";

const app = express();
app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

morgan.token("body", (req: Request, _res: Response) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(morgan("tiny"));

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
  .catch((e) => {
    logger.error("Error connecting to db");
    logger.error(e);
  });

process.on("SIGINT", closeConnection).on("SIGTERM", closeConnection);

function closeConnection() {
  logger.info("MongoDB connection closed due to app termination");
  mongoose.connection.close();
  process.exit(0);
}

app.get("/api/blogs/", (_req, res) => {
  res.send({ test: "hello world" });
});
