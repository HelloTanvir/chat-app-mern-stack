import { LoadingState, LoadingStateAction } from '../../types';

const loadingReducer = (state: LoadingState = false, action: LoadingStateAction): LoadingState => {
    switch (action.type) {
        case 'LOADING_STATE_ON':
            return true;

        case 'LOADING_STATE_OFF':
            return false;

        default:
            return state;
    }
};

export default loadingReducer;
