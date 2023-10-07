import { Request } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../controllers/login";
import config from "./config";

function getTokenFrom(req: Request) {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
}

export default function getUserFromToken(req: Request) {
  const token = getTokenFrom(req);

  if (!token) {
    return null;
  }

  return jwt.verify(token, config.SECRET) as jwtPayload;
}
