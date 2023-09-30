import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import type { Request, Response } from "express";
const app = express();

dotenv.config();
morgan.token("body", (req: Request, _res: Response) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(morgan("tiny"));

const port = process.env.PORT || 3001;

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fullstackopencluster.zgr0jwp.mongodb.net/blogs?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error("Error connecting to db");
    console.error(e);
  });

process.on("SIGINT", closeConnection).on("SIGTERM", closeConnection);

function closeConnection() {
  console.log("MongoDB connection closed due to app termination");
  mongoose.connection.close();
  process.exit(0);
}

app.get("/api/blogs/", (_req, res) => {
  res.send({ test: "hello world" });
});
