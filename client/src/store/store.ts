import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Conversation, LoadingState, Message, User } from '../types';
import conversationsReducer from './reducers/conversationsReducer';
import loadingReducer from './reducers/loadingReducer';
import messageReducer from './reducers/messageReducer';
import selectedConversationReducer from './reducers/selectedConversationReducer';
import userReducer from './reducers/userReducer';

export const defaultUser: User = {
    name: '',
    email: '',
    mobile: '',
    password: '',
    image: '',
};

export const defaultConversation: Conversation = {
    _id: '',
    creator: {
        id: '',
        name: '',
        email: '',
        image: '',
    },
    participant: {
        id: '',
        name: '',
        email: '',
        image: '',
    },
    last_updated: '',
};

const rootReducer = combineReducers({
    user: userReducer,
    conversations: conversationsReducer,
    selectedConversation: selectedConversationReducer,
    messages: messageReducer,
    loading: loadingReducer,
});

const initialState: {
    user: User;
    conversations: Conversation[];
    selectedConversation: Conversation;
    messages: Message[];
    loading: LoadingState;
} = {
    user: defaultUser,
    conversations: [],
    selectedConversation: defaultConversation,
    messages: [],
    loading: false,
};

const middleware = [thunk];

export const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line no-undef
export type RootState = ReturnType<typeof store.getState>;
