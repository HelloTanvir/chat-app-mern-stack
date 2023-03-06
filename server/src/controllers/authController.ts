import { Request, Response } from "express";
import People, { IPeople } from "../models/People";
import cloudinary from "../utils/cloudinary";

// get token from model, create cookie and send response
const sendTokenResponse = (
  people: IPeople,
  statusCode: number,
  res: Response
) => {
  const token = people.getSignedJwtToken();

  let options: { expires?: Date; httpOnly?: boolean; secure?: boolean } = {};

  if (process.env.JWT_COOKIE_EXPIRE) {
    options = {
      expires: new Date(
        Date.now() + +process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  }

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
    // options.sameSite = 'none';
  }

  res.status(statusCode).cookie("token", token, options).json({
    token,
    data: people,
  });
};

export const signup = async (req: Request, res: Response) => {
  const { email } = req.body;
  let uploadedImage: { secure_url?: string } = {};

  try {
    if (req.files && req.files.length > 0) {
      const files: any[] = Object.assign(req.files);
      uploadedImage = await cloudinary.uploader.upload(files[0].path, {
        folder: "Chat-App/Profile-Images",
      });
    }
    // if (req.file) {
    //   uploadedImage = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "Chat-App/Profile-Images",
    //   });
    // }

    const people = new (People as any)({
      ...req.body,
      image:
        uploadedImage.secure_url ||
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    });

    await people.save();

    const signedUpUser: IPeople = await (People as any).findOne({ email });

    sendTokenResponse(signedUpUser, 201, res);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      errors: {
        common: {
          msg: err.message || "Server error occured",
        },
      },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const people: IPeople = await (People as any).findOne({ email });

    if (!people)
      return res.status(401).json({
        errors: {
          email: {
            msg: "You are not signed up with this email",
          },
        },
      });

    const isPasswordMatch = await people.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        errors: {
          password: {
            msg: "Incorrect password",
          },
        },
      });
    }

    return sendTokenResponse(people, 200, res);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      errors: {
        common: {
          msg: err.message || "Server error occured",
        },
      },
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "You are logged out",
    });
};

export const allowLoggedInUser = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "You are currently logged in", data: (req as any).user });
};
