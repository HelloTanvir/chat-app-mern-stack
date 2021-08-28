import { NextFunction, Request, Response } from "express";
import uploader from "../utils/multipleUploader";

function attachmentUpload(req: Request, res: Response, next: NextFunction) {
  const upload = uploader(
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    2,
    "Only .jpg, jpeg or .png format allowed!"
  );

  // call the middleware function
  (upload as any).any()(req, res, (err: any) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      next();
    }
  });
}

export default attachmentUpload;
