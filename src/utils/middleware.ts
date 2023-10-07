import logger from "./logger";
import type { Request, Response, NextFunction } from "express";

function requestLogger(req: Request, _res: Response, next: NextFunction) {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
}

function unknownEndpoint(_req: Request, res: Response) {
  res.sendStatus(404);
}

function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
}

export default { requestLogger, unknownEndpoint, errorHandler };
