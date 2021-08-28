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
exports.allowLoggedInUser = exports.logout = exports.login = exports.signup = void 0;
const People_1 = __importDefault(require("../models/People"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
// get token from model, create cookie and send response
const sendTokenResponse = (people, statusCode, res) => {
    const token = people.getSignedJwtToken();
    let options = {};
    if (process.env.JWT_COOKIE_EXPIRE) {
        options = {
            expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
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
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    let uploadedImage = {};
    try {
        if (req.files && req.files.length > 0) {
            const files = Object.assign(req.files);
            uploadedImage = yield cloudinary_1.default.uploader.upload(files[0].path, {
                folder: "Chat-App/Profile-Images",
            });
        }
        // if (req.file) {
        //   uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "Chat-App/Profile-Images",
        //   });
        // }
        const people = new People_1.default(Object.assign(Object.assign({}, req.body), { image: uploadedImage.secure_url ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" }));
        yield people.save();
        const signedUpUser = yield People_1.default.findOne({ email });
        sendTokenResponse(signedUpUser, 201, res);
    }
    catch (err) {
        res.status(err.statusCode || 500).json({
            errors: {
                common: {
                    msg: err.message || "Server error occured",
                },
            },
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const people = yield People_1.default.findOne({ email });
        if (!people)
            return res.status(401).json({
                errors: {
                    email: {
                        msg: "You are not signed up with this email",
                    },
                },
            });
        const isPasswordMatch = people.matchPassword(password);
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
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            errors: {
                common: {
                    msg: err.message || "Server error occured",
                },
            },
        });
    }
});
exports.login = login;
const logout = (req, res) => {
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
exports.logout = logout;
const allowLoggedInUser = (req, res) => {
    res
        .status(200)
        .json({ message: "You are currently logged in", data: req.user });
};
exports.allowLoggedInUser = allowLoggedInUser;
