import { User, UserAction } from '../../types';
import { defaultUser } from '../store';

const userReducer = (state: User = defaultUser, action: UserAction): User => {
    switch (action.type) {
        case 'LOGIN_USER':
            return { ...action.payload.user };

        case 'LOGOUT_USER':
            return defaultUser;

        default:
            return state;
    }
};

export default userReducer;
