import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  text: string;
  attachments: string[];
  sender: {
    id: mongoose.Types.ObjectId;
    email: string;
    image: string;
  };
  receiver: {
    id: mongoose.Types.ObjectId;
    email: string;
    image: string;
  };
  date_time: number;
  conversation_id: mongoose.Types.ObjectId;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    text: {
      type: String,
    },
    attachments: [
      {
        type: String,
      },
    ],
    sender: {
      id: mongoose.Types.ObjectId,
      email: String,
      image: String,
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      email: String,
      image: String,
    },
    date_time: {
      type: Number,
      default: Date.now,
    },
    conversation_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
