import express from "express";
import Blog from "../models/blogs";
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
  const blogSchema = z.object({
    title: z.string().min(5),
    author: z.string(),
    url: z.string(),
    likes: z.number().default(0),
  });

  const parsedData = blogSchema.safeParse(body);

  if (!parsedData.success) {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  const parsedBody = body as z.infer<typeof blogSchema>;
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

export default blogsRouter;
