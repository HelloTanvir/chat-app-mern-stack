// external imports
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "./cloudinary";

const uploader = (
  allowedFileTypes: string[],
  maxFileSize: number,
  maxNumberOfFiles: number,
  errorMsg: string
) => {
  // define the storage - standard way
  // const storage = multer.diskStorage({
  //   filename: (req, file, cb) => {
  //     const fileExt = path.extname(file.originalname);
  //     const fileName = `${file.originalname
  //       .replace(fileExt, "")
  //       .toLowerCase()
  //       .split(" ")
  //       .join("-")}-${Date.now()}`;

  //     cb(null, fileName + fileExt);
  //   },
  // });

  // define the storage - for uploading images to cloudinary
  const storage = new (CloudinaryStorage as any)({
    cloudinary,
    params: {
      folder: 'Chat-App/Attachments'
    }
  });

  // preapre the final multer upload object
  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (req.files && req.files.length > maxNumberOfFiles) {
        cb(
          createHttpError(
            `Maximum ${maxNumberOfFiles} files are allowed to upload!`
          )
        );
      } else if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createHttpError(errorMsg));
      }
    },
  });

  return upload;
}

export default uploader;
