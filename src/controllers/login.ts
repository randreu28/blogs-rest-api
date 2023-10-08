import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import express from "express";
import User from "../models/users";
import { z } from "zod";
import parseBody from "../utils/parser";
import config from "../utils/config";

const loginRouter = express.Router();
const zodLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

loginRouter.post("/", async (req, res) => {
  const { body, parseError } = parseBody(req, zodLoginSchema);

  if (parseError) {
    return res.sendStatus(400);
  }

  const { username, password } = body;
  const user = await User.findOne({ username });

  if (!user || !user.passwordHash || !user.username || !user.id) {
    return res.sendStatus(404);
  }

  const isPasswordOk =
    user === null ? false : await bcryptjs.compare(password, user.passwordHash);

  if (!isPasswordOk) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  } satisfies jwtPayload;

  const token = jwt.sign(userForToken, config.SECRET);

  res
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id });
});

export type jwtPayload = {
  username: string;
  id: string;
};

export default loginRouter;
