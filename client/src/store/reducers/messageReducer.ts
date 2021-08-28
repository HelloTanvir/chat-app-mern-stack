import { GetMessagesAction, Message } from '../../types';

const messageReducer = (state: Message[] = [], action: GetMessagesAction): Message[] => {
    switch (action.type) {
        case 'GET_MESSAGES':
            return [...action.payload.messages];

        case 'SEND_MESSAGE':
            return [...state, action.payload.message];

        default:
            return state;
    }
};

export default messageReducer;
