import express from "express";
import Blog, { zodBlogSchema } from "../models/blogs";
import User from "../models/users";
import getUserFromToken from "../utils/jwt";
import parseBody from "../utils/parser";

const blogsRouter = express.Router();

// GET all blogs
blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({}).populate("user");

  res.json(blogs.map((blog) => blog));
});

// POST a new blog
blogsRouter.post("/", async (req, res) => {
  const { body, parseError } = parseBody(req, zodBlogSchema);

  if (parseError) {
    return res.sendStatus(400);
  }

  const user = getUserFromToken(req);

  if (!user) {
    return res.sendStatus(401);
  }

  const userExists = await User.findOne({ username: user.username });

  if (!userExists) {
    return res.sendStatus(401);
  }

  const blog = new Blog({ ...body, user: userExists.id });
  const savedBlog = await blog.save();

  await User.findByIdAndUpdate(userExists.id, {
    $push: { blogs: savedBlog._id },
  });

  res.json(savedBlog.toJSON());
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

  const user = getUserFromToken(req);

  if (!user) {
    return res.sendStatus(401);
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.sendStatus(404);
  }
  const originalUser = await User.findById(blog.user);
  const requesterUser = await User.findById(user.id);

  if (!originalUser || !requesterUser) {
    return res.sendStatus(401);
  }

  if (!originalUser._id.equals(requesterUser._id)) {
    return res.sendStatus(401);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  res.json(updatedBlog);
});

export default blogsRouter;
