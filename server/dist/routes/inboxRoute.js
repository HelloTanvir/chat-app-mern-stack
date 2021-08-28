"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inboxController_1 = require("../controllers/inboxController");
const attachmentUpload_1 = __importDefault(require("../middleware/attachmentUpload"));
const checkLogin_1 = __importDefault(require("../middleware/checkLogin"));
const router = (0, express_1.Router)();
// get all conversations
router.get("/conversations", checkLogin_1.default, inboxController_1.getConversations);
// add conversation
router.post("/conversation", checkLogin_1.default, inboxController_1.addConversation);
// get messages of a conversation
router.get("/messages/:conversation_id", checkLogin_1.default, inboxController_1.getMessages);
// send message
router.post("/message", checkLogin_1.default, attachmentUpload_1.default, inboxController_1.sendMessage);
exports.default = router;
