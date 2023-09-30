import type { Request, Response } from "express";
import express from "express";
import morgan from "morgan";
import blogsRouter from "./controllers/blogs";
import { dbConnect } from "./utils/dbConnect";
import middleware from "./utils/middleware";

const app = express();

app.use(middleware.requestLogger);
morgan.token("body", (req: Request, _res: Response) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(morgan("tiny"));

dbConnect(app);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
