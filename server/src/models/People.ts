import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Document } from "mongoose";

export interface IPeople extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  image: boolean;
  matchPassword: (password: string) => boolean;
  getSignedJwtToken: () => string;
}

const peopleSchema = new mongoose.Schema<IPeople>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please input your name"],
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Please input your email"],
      lowercase: true,
    },

    mobile: {
      type: String,
      trim: true,
      required: [true, "Please input your mobile"],
    },

    password: {
      type: String,
      required: [true, "Please input your password"],
    },

    image: String,
  },
  { timestamps: true }
);

// hash password before save
peopleSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// match password for login
peopleSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

// save token on cookie when admin is logged in
peopleSchema.methods.getSignedJwtToken = function (): string {
  if (process.env.JWT_SECRET) {
    // eslint-disable-next-line no-underscore-dangle
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  } else {
    return '';
  }
};

const People = mongoose.model("People", peopleSchema);
export default People;
