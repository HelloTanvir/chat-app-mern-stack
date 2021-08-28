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
exports.sendMessage = exports.getMessages = exports.addConversation = exports.getConversations = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const Message_1 = __importDefault(require("../models/Message"));
const People_1 = __importDefault(require("../models/People"));
// get all conversations
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let conversations;
    try {
        conversations = yield Conversation_1.default.find({
            $or: [
                { "creator.id": (_a = req.user) === null || _a === void 0 ? void 0 : _a._id },
                { "participant.id": (_b = req.user) === null || _b === void 0 ? void 0 : _b._id },
            ],
        });
        // const conversations = await Conversation.find({ 'creator.id': req.user._id });
        res.status(200).json({
            message: `Conversations associated with user: ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.email} `,
            data: conversations,
        });
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
exports.getConversations = getConversations;
// add conversation
const addConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        if (req.body.participantEmail === ((_d = req.user) === null || _d === void 0 ? void 0 : _d.email)) {
            return res.status(400).json({
                errors: {
                    email: {
                        msg: "This is your own email!",
                    },
                },
            });
        }
        const participant = yield People_1.default.findOne({
            email: req.body.participantEmail,
        });
        if (!participant) {
            return res.status(400).json({
                errors: {
                    email: {
                        msg: "No user found with that email",
                    },
                },
            });
        }
        const conversations = yield Conversation_1.default.find({
            $and: [
                { "participant.email": participant.email },
                { "creator.email": (_f = (_e = req) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.email },
            ],
        });
        if (conversations.length > 0) {
            return res.status(400).json({
                errors: {
                    email: {
                        msg: `You already have a conversation with ${participant.name}`,
                    },
                },
            });
        }
        const conversationAsParticipant = yield Conversation_1.default.findOne({
            $and: [
                { "creator.email": participant.email },
                { "participant.email": (_h = (_g = req) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.email },
            ],
        });
        if (conversationAsParticipant) {
            return res.status(200).json({
                data: conversationAsParticipant,
            });
        }
        const newConversation = new Conversation_1.default({
            creator: {
                id: (_j = req.user) === null || _j === void 0 ? void 0 : _j._id,
                name: (_k = req.user) === null || _k === void 0 ? void 0 : _k.name,
                email: (_l = req.user) === null || _l === void 0 ? void 0 : _l.email,
                image: ((_m = req.user) === null || _m === void 0 ? void 0 : _m.image) || null,
            },
            participant: {
                id: participant._id,
                name: participant.name,
                email: participant.email,
                image: participant.image || null,
            },
        });
        const result = yield newConversation.save();
        return res.status(201).json({
            message: "Conversation was added successfully!",
            data: result,
        });
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
exports.addConversation = addConversation;
// get messages of a conversation
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    try {
        // const messages = await Message.find({
        //     conversation_id: req.params.conversation_id,
        // }).sort('-createdAt');
        const messages = yield Message_1.default.find({
            conversation_id: req.params.conversation_id,
        });
        const { participant } = yield Conversation_1.default.findById(req.params.conversation_id);
        res.status(200).json({
            data: {
                messages,
                participant,
            },
            user: (_o = req.user) === null || _o === void 0 ? void 0 : _o._id,
            conversation_id: req.params.conversation_id,
        });
    }
    catch (err) {
        next((0, http_errors_1.default)(500, err.message || "Server error occured"));
    }
});
exports.getMessages = getMessages;
// send new message
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q, _r, _s, _t, _u;
    if (req.body.message || (req.files && req.files.length > 0)) {
        try {
            // save message text/attachment in database
            const attachments = [];
            if (req.files && req.files.length > 0) {
                // const files: {path: string}[] = Array.from(req.files);
                // files.forEach(file => attachments.push(file.path));
                for (const file of req.files) {
                    attachments.push(file.path);
                }
            }
            const newMessage = new Message_1.default({
                text: req.body.message,
                attachments,
                sender: {
                    id: (_p = req.user) === null || _p === void 0 ? void 0 : _p._id,
                    email: (_q = req.user) === null || _q === void 0 ? void 0 : _q.email,
                    image: ((_r = req.user) === null || _r === void 0 ? void 0 : _r.image) || null,
                },
                receiver: {
                    id: req.body.receiverId,
                    email: req.body.receiverEmail || null,
                    image: req.body.receiverImage || null,
                },
                conversation_id: req.body.conversationId,
            });
            // if (req.files && req.files.length > 0) {
            //   const files: any[] = Array.from(req.files);
            //   files.forEach(async (file, index) => {          
            //     const uploadedImage = await cloudinary.uploader.upload(file.path, {
            //       folder: "Chat-App/Attachments",
            //     });          
            //     attachments.push(uploadedImage.secure_url);
            //     if(index === files.length - 1){
            //       newMessage.attachments = attachments;
            //       result = await newMessage.save();
            //     }
            //   });
            // }
            const result = yield newMessage.save();
            // emit socket event
            global.io.emit("new_message", {
                message: {
                    conversation_id: req.body.conversationId,
                    sender: {
                        id: (_s = req.user) === null || _s === void 0 ? void 0 : _s._id,
                        email: (_t = req.user) === null || _t === void 0 ? void 0 : _t.email,
                        image: ((_u = req.user) === null || _u === void 0 ? void 0 : _u.image) || null,
                    },
                    text: req.body.message,
                    attachments: attachments,
                    date_time: result.date_time,
                },
            });
            res.status(200).json({
                message: "Successful!",
                data: result,
            });
        }
        catch (err) {
            next((0, http_errors_1.default)(500, err.message || "Server error occured"));
        }
    }
    else {
        next((0, http_errors_1.default)(400, "Text or attachment is required"));
    }
});
exports.sendMessage = sendMessage;
