import mongoose from "mongoose";
import { z } from "zod";

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

/* For parsing */
export const zodUserSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(3),
  password: z.string().min(3),
});

/* For testing */
export type UserType = z.infer<typeof zodUserSchema>;

const User = mongoose.model("User", userSchema);

export default User;
