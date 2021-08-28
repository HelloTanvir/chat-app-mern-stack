import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkLogin } from '../../store/actions/authAction';
import Chat from '../chat/Chat';
import Sidebar from '../sidebar/Sidebar';

const Inbox: FC = (): ReactElement => {
    const history = useHistory();

    const dispatch = useDispatch();

    // check if login
    useEffect(() => {
        dispatch(checkLogin(history, '/'));
    }, [dispatch, history]);

    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            <Sidebar />
            <Chat />
        </div>
    );
};

export default Inbox;
