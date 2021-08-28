import mongoose, { Document } from "mongoose";

export interface IConversation extends Document {
  creator: {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    image: string;
  };
  participant: {
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    image: string;
  };
  last_updated: number;
}

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      name: String,
      email: String,
      image: String,
    },
    participant: {
      id: mongoose.Types.ObjectId,
      name: String,
      email: String,
      image: String,
    },
    last_updated: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
