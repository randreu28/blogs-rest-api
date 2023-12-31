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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

/* For parsing */
export const zodBlogSchema = z.object({
  title: z.string().min(5),
  author: z.string(),
  url: z.string(),
  likes: z.number().default(0),
});

/* For testing */
export interface BlogType extends z.infer<typeof zodBlogSchema> {
  id?: string;
  user: string;
}

export default mongoose.model("Blog", blogSchema);
