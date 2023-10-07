import bcryptjs from "bcryptjs";
import express from "express";
import User, { zodUserSchema } from "../models/users";
import parseBody from "../utils/parser";

const usersRouter = express.Router();

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { body, parseError } = parseBody(req, zodUserSchema);

  if (parseError) {
    return res.sendStatus(400);
  }

  const { name, password, username } = body;
  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

export default usersRouter;
