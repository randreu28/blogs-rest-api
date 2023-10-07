import bcryptjs from "bcryptjs";
import supertest from "supertest";
import app from "..";
import blogs, { BlogType } from "../models/blogs";
import User from "../models/users";
import helper from "./test_helper";

const api = supertest(app);
let token: string;
let rootUserId: string;

beforeEach(async () => {
  await blogs.deleteMany({});
  await User.deleteMany({});

  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash("secret", saltRounds);
  const user = new User({
    name: "root",
    username: "root",
    passwordHash: passwordHash,
  });
  const savedUser = await user.save();
  rootUserId = savedUser.id;

  const response = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  token = response.body.token;

  for (const blog of helper.getInitialBlogs(rootUserId)) {
    const blogObject = new blogs(blog);
    await blogObject.save();
    await User.findByIdAndUpdate(rootUserId, {
      $push: { blogs: blogObject._id },
    });
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("correct amount of blog posts are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.getInitialBlogs(rootUserId).length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body as BlogType[];
  const ids = blogs.map((blog) => blog.id);

  for (const id of ids) {
    expect(id).toBeDefined();
  }
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const blogs = response.body as BlogType[];
  const contents = blogs.map((blog) => blog.title);

  expect(response.body).toHaveLength(
    helper.getInitialBlogs(rootUserId).length + 1
  );
  expect(contents).toContain("New Blog");
});

test("if likes property is missing, it will default to 0", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const returnedBlog = response.body;
  expect(returnedBlog.likes).toBeDefined();
  expect(returnedBlog.likes).toBe(0);
});

test("if title or url property is missing, it responds with 400 Bad Request", async () => {
  const newBlogWithoutTitle = {
    author: "New Author",
    url: "http://newblog.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400);

  const newBlogWithoutUrl = {
    title: "New Blog",
    author: "New Author",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400);
});

test("delete a blog post", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
    likes: 5,
  };

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogToDelete = postResponse.body;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const getResponse = await api.get("/api/blogs");
  const blogsAfterDelete = getResponse.body as BlogType[];

  expect(blogsAfterDelete).not.toContainEqual(blogToDelete);
});

test("update a blog post", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
    likes: 5,
  };

  const postResponse = await api
    .post("/api/blogs/")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogToUpdate = postResponse.body as BlogType;
  const updatedBlog = {
    ...newBlog,
    title: "Updated Blog",
  };

  const putResponse = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const returnedBlog = putResponse.body;
  expect(returnedBlog.title).toBe("Updated Blog");
});
