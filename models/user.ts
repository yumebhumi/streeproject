import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser {
  email: string;
  password: string;
  userName: string;
  isAdmin: boolean;
}

export interface IUserMethods {
  generateToken(): Promise<string | undefined>;
}

export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Hash the password before saving, only when it was modified.
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    next();
    return;
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, saltRound);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Issue a JWT for the user.
userSchema.methods.generateToken = async function (): Promise<string | undefined> {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET_KEY as string,
    );
  } catch (error) {
    console.error((error as Error).message);
    return undefined;
  }
};

const User =
  (mongoose.models.User as UserModel) ||
  mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
