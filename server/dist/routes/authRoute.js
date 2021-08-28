"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authValidator_1 = require("../middleware/authValidator");
const checkLogin_1 = __importDefault(require("../middleware/checkLogin"));
const profileImageUpload_1 = __importDefault(require("../middleware/profileImageUpload"));
const router = (0, express_1.Router)();
router.post("/signup", profileImageUpload_1.default, authValidator_1.signupValidator, authValidator_1.authValidationHandler, authController_1.signup);
router.post("/login", authValidator_1.loginValidator, authValidator_1.authValidationHandler, authController_1.login);
router.get("/logout", checkLogin_1.default, authController_1.logout);
router.get("/checklogin", checkLogin_1.default, authController_1.allowLoggedInUser);
exports.default = router;
