/* eslint-disable no-underscore-dangle */
import { makeStyles } from '@material-ui/core';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Empty, Input } from 'antd';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import userAvatar from '../../assets/images/Profile_avatar_placeholder_large.png';
import { fetchMessages, sendMessage } from '../../store/actions/conversationAction';
import { RootState } from '../../store/store';
import { Conversation, Message, User } from '../../types';
import axios from '../../utils/axios';
import Classes from './Chat.module.css';

const useStyles = makeStyles(() => ({
    attchmentIcon: {
        marginRight: 10,
        cursor: 'pointer',
        color: '#fff',
        transition: 'all 0.2s ease-in-out',
        '&:active': {
            fontSize: 20,
        },
        '&:hover': {
            color: '#7373e6',
        },
    },
    optionIcon: {
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

const Chat: FC = (): ReactElement => {
    const classes = useStyles();

    const socket = useRef<any>(null);
    const messageRef = useRef<Input>(null);
    const lastMsgRef = useRef<HTMLDivElement>(null);
    const [attachments, setAttachments] = useState<FileList | null>(null);

    const user: User = useSelector<RootState, User>((state) => state.user);
    const messages: Message[] = useSelector<RootState, Message[]>((state) => state.messages);
    const selectedConversation: Conversation = useSelector<RootState, Conversation>(
        (state) => state.selectedConversation
    );

    const dispatch = useDispatch();

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_API_URL || '');

        socket.current.on('new_message', (data: { message: Message }) => {
            if (selectedConversation._id === data.message.conversation_id)
                dispatch(sendMessage(data.message));
        });

        return () => {
            socket.current.off('new_message');
            socket.current.close();
        };
    }, [dispatch, selectedConversation._id]);

    useEffect(() => {
        dispatch(fetchMessages(selectedConversation._id));
    }, [dispatch, selectedConversation._id]);

    useEffect(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMsg = async (text: string): Promise<void> => {
        if (text || (attachments && attachments.length > 0)) {
            try {
                const data = new FormData();
                data.append('message', text);
                data.append('receiverId', selectedConversation.participant.id);
                data.append('receiverEmail', selectedConversation.participant.email);
                data.append('receiverImage', selectedConversation.participant.image);
                data.append('conversationId', selectedConversation._id);

                if (attachments && attachments.length > 0) {
                    data.append('attachments', attachments[0]);
                    data.append('attachments', attachments[1]);
                }

                const result = await axios.post('/inbox/message', data);

                if (result) {
                    messageRef.current?.setValue('');
                    setAttachments(null);
                }
            } catch (err) {
                const error: any = err;
                console.log(error.response);
            }
        }
    };

    return selectedConversation._id ? (
        <div className={Classes.chat}>
            <div className={Classes.header}>
                <img
                    src={selectedConversation.participant.image || userAvatar}
                    alt="user"
                    className={Classes.userImg}
                />
                <h3 className={Classes.userName}>{selectedConversation.participant.name}</h3>
                <MoreVertIcon className={classes.optionIcon} />
            </div>

            <div className={Classes.body}>
                <div className={Classes.msgContainer}>
                    {selectedConversation.creator.email === user.email
                        ? messages.map((message, index) => {
                              const lastMsg: boolean = messages.length - 1 === index;

                              return (
                                  <div
                                      key={message.date_time.toString()}
                                      ref={lastMsg ? lastMsgRef : null}
                                      className={Classes.msgWrapper}
                                  >
                                      {message.sender.email !== user.email ? (
                                          <img
                                              src={message.sender.image || userAvatar}
                                              alt="participant"
                                              className={Classes.participantImg}
                                          />
                                      ) : null}

                                      <span
                                          className={`${
                                              message.sender.email === user.email
                                                  ? Classes.sentMsg
                                                  : Classes.receivedMsg
                                          } ${Classes.msg}`}
                                      >
                                          {message.attachments?.map((i) => (
                                              <img
                                                  key={i}
                                                  className={Classes.attachment}
                                                  src={i}
                                                  alt="attachment"
                                              />
                                          ))}
                                          {message.text}
                                      </span>
                                  </div>
                              );
                          })
                        : null}
                </div>
            </div>

            <div className={Classes.sendMsgBox}>
                <span>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="icon-button-file">
                        <InsertPhotoIcon className={classes.attchmentIcon} />
                    </label>

                    <input
                        accept="image/*"
                        type="file"
                        multiple
                        max={2}
                        onChange={(e) => setAttachments(e.target.files)}
                        id="icon-button-file"
                        hidden
                    />
                </span>

                <Input.Search
                    ref={messageRef}
                    placeholder="send a message"
                    allowClear
                    enterButton="Send"
                    size="large"
                    onSearch={handleSendMsg}
                />
            </div>
        </div>
    ) : (
        <Empty className={Classes.empty} description={false} />
    );
};

export default Chat;
