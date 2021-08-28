"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const People_1 = __importDefault(require("../models/People"));
// auth guard to protect routes that need authentication
const checkLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        // set token from Bearer token in header
        [, token] = req.headers.authorization.split(" ");
    }
    else if (req.cookies.token) {
        // set token from cookie
        token = req.cookies.token;
    }
    // make sure token exists
    if (!token)
        return next((0, http_errors_1.default)(401, "Not authorized to get access to this route"));
    try {
        // verify token
        const decoded = process.env.JWT_SECRET ? jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET) : '';
        const user = yield People_1.default.findById(decoded.id);
        if (!user)
            return next((0, http_errors_1.default)(401, "Not authorized to get access to this route"));
        req.user = user;
        return next();
    }
    catch (err) {
        return next((0, http_errors_1.default)(401, "Not authorized to get access to this route"));
    }
});
exports.default = checkLogin;
