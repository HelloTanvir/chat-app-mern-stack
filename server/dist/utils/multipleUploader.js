"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// external imports
const http_errors_1 = __importDefault(require("http-errors"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploader = (allowedFileTypes, maxFileSize, maxNumberOfFiles, errorMsg) => {
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
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.default,
        params: {
            folder: 'Chat-App/Attachments'
        }
    });
    // preapre the final multer upload object
    const upload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (req.files && req.files.length > maxNumberOfFiles) {
                cb((0, http_errors_1.default)(`Maximum ${maxNumberOfFiles} files are allowed to upload!`));
            }
            else if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb((0, http_errors_1.default)(errorMsg));
            }
        },
    });
    return upload;
};
exports.default = uploader;
