import express from "express";
import Blog, { zodBlogSchema } from "../models/blogs";
import parseBody from "../utils/parser";

const blogsRouter = express.Router();

// GET all blogs
blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({});

  res.json(blogs.map((blog) => blog));
});

// POST a new blog
blogsRouter.post("/", async (req, res) => {
  const { body, parseError } = parseBody(req, zodBlogSchema);

  if (parseError) {
    return res.sendStatus(400);
  }

  const blog = new Blog(body);

  const savedBlog = await blog.save();
  res.json(savedBlog);
});

// GET a blog by id
blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
  }

  res.json(blog);
});

// DELETE a blog by id
blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.sendStatus(204);
});

// UPDATE a blog by id
blogsRouter.put("/:id", async (req, res) => {
  const { body, parseError } = parseBody(req, zodBlogSchema);

  if (parseError) {
    return res.sendStatus(400);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  res.json(updatedBlog);
});

export default blogsRouter;
