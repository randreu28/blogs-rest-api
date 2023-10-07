import { Request } from "express";
import { ZodSchema, z } from "zod";

export default function parseBody<T>(req: Request, schema: ZodSchema<T>) {
  const body = req.body;
  const { success } = schema.safeParse(body);

  if (!success) {
    return {
      parseError: new Error("Invalid booy"),
      body: null,
    };
  }

  return { parseError: null, body: body as z.infer<typeof schema> };
}
