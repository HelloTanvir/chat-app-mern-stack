import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Conversation, { IConversation } from "../models/Conversation";
import Message, { IMessage } from "../models/Message";
import People, { IPeople } from "../models/People";

// get all conversations
export const getConversations = async (req: Request, res: Response) => {
  let conversations: IConversation[];
  try {
    conversations = await (Conversation as any).find({
      $or: [
        { "creator.id": (req as any).user?._id },
        { "participant.id": (req as any).user?._id },
      ],
    });

    // const conversations = await Conversation.find({ 'creator.id': req.user._id });

    res.status(200).json({
      message: `Conversations associated with user: ${(req as any).user?.email} `,
      data: conversations,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      errors: {
        common: {
          msg: err.message || "Server error occured",
        },
      },
    });
  }
};

// add conversation
export const addConversation = async (req: Request, res: Response) => {
  try {
    if (req.body.participantEmail === (req as any).user?.email) {
      return res.status(400).json({
        errors: {
          email: {
            msg: "This is your own email!",
          },
        },
      });
    }

    const participant: IPeople = await People.findOne({
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

    const conversations: IConversation[] = await (Conversation as any).find({
      $and: [
        { "participant.email": participant.email },
        { "creator.email": (req as any)?.user?.email },
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

    const conversationAsParticipant: IConversation = await (Conversation as any).findOne(
      {
        $and: [
          { "creator.email": participant.email },
          { "participant.email": (req as any)?.user?.email },
        ],
      }
    );

    if (conversationAsParticipant) {
      return res.status(200).json({
        data: conversationAsParticipant,
      });
    }

    const newConversation = new (Conversation as any)({
      creator: {
        id: (req as any).user?._id,
        name: (req as any).user?.name,
        email: (req as any).user?.email,
        image: (req as any).user?.image || null,
      },
      participant: {
        id: participant._id,
        name: participant.name,
        email: participant.email,
        image: participant.image || null,
      },
    });

    const result = await newConversation.save();

    return res.status(201).json({
      message: "Conversation was added successfully!",
      data: result,
    });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      errors: {
        common: {
          msg: err.message || "Server error occured",
        },
      },
    });
  }
};

// get messages of a conversation
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const messages = await Message.find({
    //     conversation_id: req.params.conversation_id,
    // }).sort('-createdAt');

    const messages: IMessage = await (Message as any).find({
      conversation_id: req.params.conversation_id,
    });

    const { participant } = await (Conversation as any).findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages,
        participant,
      },
      user: (req as any).user?._id,
      conversation_id: req.params.conversation_id,
    });
  } catch (err: any) {
    next(createHttpError(500, err.message || "Server error occured"));
  }
};

// send new message
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.message || (req.files && req.files.length > 0)) {    
    try {
      // save message text/attachment in database
      const attachments: string[] = [];

      if (req.files && req.files.length > 0) {
        // const files: {path: string}[] = Array.from(req.files);
        // files.forEach(file => attachments.push(file.path));

        for (const file of (req as any).files) {
          attachments.push(file.path);
        }
      }

      const newMessage = new (Message as any)({
        text: req.body.message,
        attachments,
        sender: {
          id: (req as any).user?._id,
          email: (req as any).user?.email,
          image: (req as any).user?.image || null,
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
      const result = await newMessage.save();

      // emit socket event
      (global as any).io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: (req as any).user?._id,
            email: (req as any).user?.email,
            image: (req as any).user?.image || null,
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
    } catch (err: any) {
      next(createHttpError(500, err.message || "Server error occured"));
    }
  } else {
    next(createHttpError(400, "Text or attachment is required"));
  }
};
