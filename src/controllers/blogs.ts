import express from "express";
import Blog, { zodBlogSchema } from "../models/blogs";
import { z } from "zod";

const blogsRouter = express.Router();

// GET all blogs
blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({});

  res.json(blogs.map((blog) => blog));
});

// POST a new blog
blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const parsedData = zodBlogSchema.safeParse(body);

  if (!parsedData.success) {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  const parsedBody = body as z.infer<typeof zodBlogSchema>;
  const blog = new Blog(parsedBody);

  const savedBlog = await blog.save();
  res.json(savedBlog);
});

// GET a blog by id
blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

// DELETE a blog by id
blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

// UPDATE a blog by id
blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const parsedData = zodBlogSchema.safeParse(body);

  if (!parsedData.success) {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  const parsedBody = body as z.infer<typeof zodBlogSchema>;
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, parsedBody, {
    new: true,
  });
  res.json(updatedBlog);
});

export default blogsRouter;
