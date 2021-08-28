"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const singleUploader_1 = __importDefault(require("../utils/singleUploader"));
const profileImageUpload = (req, res, next) => {
    const upload = (0, singleUploader_1.default)(["image/jpeg", "image/jpg", "image/png"], 1000000, "Only .jpg, jpeg or .png format allowed!");
    // call the middleware function
    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                message: err.message,
            });
        }
        else {
            next();
        }
    });
};
exports.default = profileImageUpload;
