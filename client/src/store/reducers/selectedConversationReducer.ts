import { Conversation, SelectedConversationAction } from '../../types';
import { defaultConversation } from '../store';

const selectedConversationReducer = (
    state: Conversation = defaultConversation,
    action: SelectedConversationAction
): Conversation => {
    switch (action.type) {
        case 'SELECT_CONVERSATION':
            return { ...action.payload.conversation };

        default:
            return state;
    }
};

export default selectedConversationReducer;
