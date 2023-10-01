import mongoose from "mongoose";
import { z } from "zod";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
  },
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0,
  },
});

blogSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export type BlogType = {
  title: string;
  author?: string;
  url?: string;
  likes?: number;
  id?: number;
};

export const zodBlogSchema = z.object({
  title: z.string().min(5),
  author: z.string(),
  url: z.string(),
  likes: z.number().default(0),
});

export default mongoose.model("Blog", blogSchema);
