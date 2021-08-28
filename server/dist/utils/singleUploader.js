"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uploader = (allowedFileTypes, maxFileSize, errorMsg) => {
    // define the storage
    const storage = multer_1.default.diskStorage({
        filename: (req, file, cb) => {
            const fileExt = path_1.default.extname(file.originalname);
            const fileName = `${file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-")}-${Date.now()}`;
            cb(null, fileName + fileExt);
        },
    });
    // preapre the final multer upload object
    const upload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb((0, http_errors_1.default)(400, errorMsg));
            }
        },
    });
    return upload;
};
exports.default = uploader;
