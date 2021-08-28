"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multipleUploader_1 = __importDefault(require("../utils/multipleUploader"));
function attachmentUpload(req, res, next) {
    const upload = (0, multipleUploader_1.default)(["image/jpeg", "image/jpg", "image/png"], 1000000, 2, "Only .jpg, jpeg or .png format allowed!");
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
}
exports.default = attachmentUpload;
