import express from "express";

const blogsRouter = express.Router();

blogsRouter.get("/", (_req, res) => {
  res.send({ test: "hello world" });
});

export default blogsRouter;
