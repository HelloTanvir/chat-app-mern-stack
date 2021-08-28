"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.statusCode = err.statusCode;
    error.message = err.message;
    console.log(err);
    // bad object id
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = (0, http_errors_1.default)(404, message);
    }
    // mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = (0, http_errors_1.default)(400, message);
    }
    // mongoose validation error
    // if (err.name === 'ValidationError') {
    //     const message = Object.values(err.errors).map((val) => val.message);
    //     error = createHttpError(400, message);
    // }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server error",
    });
};
exports.default = errorHandler;
