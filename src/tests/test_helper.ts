import Blog, { BlogType } from "../models/blogs";
import User from "../models/users";

const getInitialBlogs = (user: string): BlogType[] => {
  return [
    {
      title: "Fake Blog 1",
      author: "Fake Author 1",
      url: "http://fakeblog1.com",
      likes: 3,
      user: user,
    },
    {
      title: "Fake Blog 2",
      author: "Fake Author 2",
      url: "http://fakeblog2.com",
      likes: 2,
      user: user,
    },
    {
      title: "Fake Blog 3",
      author: "Fake Author 3",
      url: "http://fakeblog3.com",
      likes: 1,
      user: user,
    },
  ];
};

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" });
  await blog.save();
  await Blog.deleteOne({ _id: blog._id });

  return blog._id.toString();
};

const blogsInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export default {
  getInitialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
