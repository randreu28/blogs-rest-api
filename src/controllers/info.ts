import express from "express";
import Blog from "../models/blogs";

const infoRouter = express.Router();

// GET general info for the app
infoRouter.get("/info", async (_req, res) => {
  const blogs = await Blog.find({});

  res.send(`
        <p>There are ${blogs.length} blogs avaialable<p/>
        <p>${new Date().toString()}</p>
    `);
});

export default infoRouter;
