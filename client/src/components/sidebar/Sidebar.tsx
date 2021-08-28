/* eslint-disable no-underscore-dangle */
import { InputAdornment, makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import userAvatar from '../../assets/images/Profile_avatar_placeholder_large.png';
import { logoutUser } from '../../store/actions/authAction';
import {
    addConversation,
    getConversations,
    // eslint-disable-next-line prettier/prettier
    selectConversation
} from '../../store/actions/conversationAction';
import { RootState } from '../../store/store';
import { Conversation, User } from '../../types';
import Classes from './Sidebar.module.css';

const useStyles = makeStyles(() => ({
    searchField: {
        flex: 1,
        '& input': {
            color: '#fff',
        },
        '& div::before': {
            borderColor: '#fff',
        },
        '& label': {
            color: '#fff',
        },
    },
    logoutIcon: {
        // color: '#fff',
        placeSelf: 'center',
        backgroundColor: '#a19898',
        padding: 5,
        borderRadius: '50%',
        height: 30,
        width: 30,
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:active': {
            height: 20,
            width: 20,
        },
        '&:hover': {
            backgroundColor: '#beb5b5',
        },
    },
}));

const Sidebar: FC = (): ReactElement => {
    const classes = useStyles();

    const history = useHistory();

    const [selectedConversationId, setSelectedConversationId] = useState<string>('');
    const [participantEmail, setParticipantEmail] = useState<string>('');
    const [conversationAddError, setConversationAddError] = useState<string>('');

    const user: User = useSelector<RootState, User>((state) => state.user);

    const conversations: Conversation[] = useSelector<RootState, Conversation[]>(
        (state) => state.conversations
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getConversations(user.email));
    }, [dispatch, user.email]);

    const handleSelectConversation = (conversation: Conversation): void => {
        setSelectedConversationId(conversation._id);
        dispatch(selectConversation(conversation));
    };

    const handleLogout = (): void => {
        dispatch(logoutUser(history));
    };

    const handleAddConversation = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        dispatch(addConversation(participantEmail, setConversationAddError));
        setParticipantEmail('');
    };

    return (
        <div className={Classes.sidebar}>
            <div className={Classes.header}>
                <img
                    className={Classes.ownImg}
                    src={user.image.toString() || userAvatar}
                    alt="user"
                />
                <span className={Classes.ownName}>{user.name || 'User'}</span>
            </div>

            <ExitToAppIcon className={classes.logoutIcon} onClick={handleLogout} />

            <form onSubmit={handleAddConversation} className={Classes.searchBox}>
                <TextField
                    className={classes.searchField}
                    error={!!conversationAddError}
                    helperText={conversationAddError}
                    label="Add Conversation"
                    placeholder="participant's email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AddCircleOutlineIcon style={{ color: '#fff' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </form>

            <div className={Classes.conversations}>
                {conversations.map((conversation) => (
                    <div
                        key={conversation._id}
                        role="button"
                        tabIndex={0}
                        className={`${Classes.singleConversation} ${
                            selectedConversationId === conversation._id &&
                            Classes.selectedConversation
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                    >
                        <img
                            className={Classes.userImg}
                            src={conversation.participant.image}
                            alt="user"
                        />
                        <span className={Classes.userName}>{conversation.participant.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
