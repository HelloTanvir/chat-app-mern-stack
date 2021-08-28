import { Router } from "express";
import {
  addConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/inboxController";
import attachmentUpload from "../middleware/attachmentUpload";
import checkLogin from "../middleware/checkLogin";

const router: Router = Router();

// get all conversations
router.get("/conversations", checkLogin, getConversations);

// add conversation
router.post("/conversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);

// send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);

export default router;
