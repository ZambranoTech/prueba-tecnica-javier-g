import { Schema, model, models } from "mongoose";

export type User = {
  id: string;
  username: string;
  email: string;
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = models.user || model("user", userSchema);
export default UserModel;
