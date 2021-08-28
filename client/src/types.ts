export type AppHistory = any;

export interface UserLoginInfo {
    email: string;
    password: string;
}

export interface User extends UserLoginInfo {
    name: string;
    mobile: string;
    image: string | File;
}

export type UserAction =
    | { type: 'LOGIN_USER'; payload: { user: User } }
    | { type: 'LOGOUT_USER'; payload?: null };

export type LoadingState = boolean;

export type LoadingStateAction =
    | { type: 'LOADING_STATE_ON'; payload?: null }
    | { type: 'LOADING_STATE_OFF'; payload?: null };

export interface Conversation {
    _id: string;
    creator: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
    participant: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
    last_updated: string;
}

export interface Message {
    text?: string;
    attachments?: string[];
    sender: {
        id: string;
        email: string;
        image: string;
    };
    receiver: {
        id: string;
        email: string;
        image: string;
    };
    date_time: Date;
    conversation_id: string;
}

export type ConversationAction =
    | {
          type: 'GET_CONVERSATIONS';
          payload: {
              conversations: Conversation[];
              userEmail: string;
          };
      }
    | {
          type: 'ADD_CONVERSATION';
          payload: {
              conversation: Conversation;
          };
      };

export type SelectedConversationAction = {
    type: 'SELECT_CONVERSATION';
    payload: { conversation: Conversation };
};

export type GetMessagesAction =
    | {
          type: 'GET_MESSAGES';
          payload: { messages: Message[] };
      }
    | {
          type: 'SEND_MESSAGE';
          payload: { message: Message };
      };
