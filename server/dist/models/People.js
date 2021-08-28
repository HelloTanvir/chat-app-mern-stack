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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const peopleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please input your name"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please input your email"],
        lowercase: true,
    },
    mobile: {
        type: String,
        trim: true,
        required: [true, "Please input your mobile"],
    },
    password: {
        type: String,
        required: [true, "Please input your password"],
    },
    image: String,
}, { timestamps: true });
// hash password before save
peopleSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
// match password for login
peopleSchema.methods.matchPassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(enteredPassword, this.password);
        return isMatch;
    });
};
// save token on cookie when admin is logged in
peopleSchema.methods.getSignedJwtToken = function () {
    if (process.env.JWT_SECRET) {
        // eslint-disable-next-line no-underscore-dangle
        return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }
    else {
        return '';
    }
};
const People = mongoose_1.default.model("People", peopleSchema);
exports.default = People;
