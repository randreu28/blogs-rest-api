import supertest from "supertest";
import app from "..";
import blogs, { BlogType } from "../models/blogs";

const api = supertest(app);

const initialBlogs = [
  {
    title: "Fake Blog 1",
    author: "Fake Author 1",
    url: "http://fakeblog1.com",
    likes: 3,
  },
  {
    title: "Fake Blog 2",
    author: "Fake Author 2",
    url: "http://fakeblog2.com",
    likes: 2,
  },
  {
    title: "Fake Blog 3",
    author: "Fake Author 3",
    url: "http://fakeblog3.com",
    likes: 1,
  },
] satisfies BlogType[];

beforeEach(async () => {
  await blogs.deleteMany({});
  for (const blog of initialBlogs) {
    const blogObject = new blogs(blog);
    await blogObject.save();
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

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body as BlogType[];
  const ids = blogs.map((blog) => blog.id);

  for (const id of ids) {
    expect(id).toBeDefined();
  }
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const blogs = response.body as BlogType[];
  const contents = blogs.map((blog) => blog.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
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

  await api.post("/api/blogs").send(newBlogWithoutTitle).expect(400);

  const newBlogWithoutUrl = {
    title: "New Blog",
    author: "New Author",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlogWithoutUrl).expect(400);
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
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogToDelete = postResponse.body;

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const getResponse = await api.get("/api/blogs");
  const blogsAfterDelete = getResponse.body as BlogType[];

  expect(blogsAfterDelete).not.toContainEqual(blogToDelete);
});
