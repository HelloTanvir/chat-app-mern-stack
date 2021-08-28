"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    creator: {
        id: mongoose_1.default.Types.ObjectId,
        name: String,
        email: String,
        image: String,
    },
    participant: {
        id: mongoose_1.default.Types.ObjectId,
        name: String,
        email: String,
        image: String,
    },
    last_updated: {
        type: Number,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const Conversation = mongoose_1.default.model("Conversation", conversationSchema);
exports.default = Conversation;
