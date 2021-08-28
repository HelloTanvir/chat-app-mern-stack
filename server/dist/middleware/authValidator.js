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
exports.authValidationHandler = exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const People_1 = __importDefault(require("../models/People"));
exports.signupValidator = [
    (0, express_validator_1.check)("name")
        .isLength({ min: 1 })
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name should contain alphabets only")
        .trim(),
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield People_1.default.findOne({ email: value });
            if (user) {
                throw (0, http_errors_1.default)(400, "User has already created by this email");
            }
        }
        catch (err) {
            throw (0, http_errors_1.default)(err.message);
        }
    })),
    (0, express_validator_1.check)("mobile")
        .isMobilePhone("bn-BD", {
        strictMode: true,
    })
        .withMessage("Mobile number must be a valid Bangladeshi mobile number")
        .trim(),
    (0, express_validator_1.check)("password")
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"),
];
exports.loginValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("Invalid email address").trim(),
    (0, express_validator_1.check)("password")
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"),
];
const authValidationHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).mapped();
    if (Object.keys(errors).length === 0)
        return next();
    return res.status(400).json({
        errors,
    });
};
exports.authValidationHandler = authValidationHandler;
