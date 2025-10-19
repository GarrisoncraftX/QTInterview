import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  role: "admin" | "user" | "moderator"
  status: "active" | "inactive" | "suspended"
  emailHash: string
  signature: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "moderator"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    emailHash: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
