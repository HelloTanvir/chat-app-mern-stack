import createHttpError from "http-errors";
import multer from "multer";
import path from "path";

const uploader = (
  allowedFileTypes: string[],
  maxFileSize: number,
  errorMsg: string
) => {
  // define the storage
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName = `${file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-")}-${Date.now()}`;

      cb(null, fileName + fileExt);
    },
  });

  // preapre the final multer upload object
  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createHttpError(400, errorMsg));
      }
    },
  });

  return upload;
};

export default uploader;
