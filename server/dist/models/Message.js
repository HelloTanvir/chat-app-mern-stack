"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
    },
    attachments: [
        {
            type: String,
        },
    ],
    sender: {
        id: mongoose_1.default.Types.ObjectId,
        email: String,
        image: String,
    },
    receiver: {
        id: mongoose_1.default.Types.ObjectId,
        email: String,
        image: String,
    },
    date_time: {
        type: Number,
        default: Date.now,
    },
    conversation_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
const Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
