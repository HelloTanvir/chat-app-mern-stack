import { Conversation, ConversationAction } from '../../types';

const conversationsReducer = (
    state: Conversation[] = [],
    action: ConversationAction
): Conversation[] => {
    switch (action.type) {
        case 'GET_CONVERSATIONS':
            return [...action.payload.conversations].map((conversation) => {
                if (conversation.participant.email === action.payload.userEmail) {
                    const modifiedConversation = { ...conversation };

                    const creator = { ...conversation.participant };
                    const participant = { ...conversation.creator };

                    modifiedConversation.creator = creator;
                    modifiedConversation.participant = participant;

                    return modifiedConversation;
                }
                return conversation;
            });

        case 'ADD_CONVERSATION':
            return [...state, action.payload.conversation];

        default:
            return state;
    }
};

export default conversationsReducer;
