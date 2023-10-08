import type { Request } from "express";
import express from "express";
import morgan from "morgan";
import blogsRouter from "./controllers/blogs";
import { dbConnect } from "./utils/dbConnect";
import middleware from "./utils/middleware";
import infoRouter from "./controllers/info";
import "express-async-errors";
import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import cors from "cors";

const app = express();

app.use(middleware.requestLogger);
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(morgan("tiny"));

dbConnect(app);

app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/", infoRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
