import { AxiosResponse } from 'axios';
import React from 'react';
import { Conversation, Message } from '../../types';
import axios from '../../utils/axios';
import { AppDispatch } from '../store';

export const getConversations = (userEmail: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch({ type: 'LOADING_STATE_ON' });

        const response: AxiosResponse<any> = await axios.get('/inbox/conversations');

        if (response) {
            dispatch({ type: 'LOADING_STATE_OFF' });

            dispatch({
                type: 'GET_CONVERSATIONS',
                payload: { conversations: response.data.data, userEmail },
            });
        }
    } catch (err) {
        dispatch({ type: 'LOADING_STATE_OFF' });
    }
};

export const addConversation =
    (
        participantEmail: string,
        setConversationAddError: React.Dispatch<React.SetStateAction<string>>
    ) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch({ type: 'LOADING_STATE_ON' });

            const response: AxiosResponse<any> = await axios.post('/inbox/conversation', {
                participantEmail,
            });

            if (response) {
                dispatch({ type: 'LOADING_STATE_OFF' });
                dispatch({
                    type: 'ADD_CONVERSATION',
                    payload: { conversation: response.data.data },
                });
            }
        } catch (error) {
            const err: any = error;

            dispatch({ type: 'LOADING_STATE_OFF' });

            setConversationAddError(
                err.response?.data?.errors?.email?.msg ||
                    err.response?.data?.errors?.common?.msg ||
                    ''
            );
        }
    };

export const selectConversation = (conversation: Conversation) => (dispatch: AppDispatch) => {
    dispatch({ type: 'SELECT_CONVERSATION', payload: { conversation } });
};

export const fetchMessages = (conversationId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch({ type: 'LOADING_STATE_ON' });

        const response: AxiosResponse<any> = await axios.get(`/inbox/messages/${conversationId}`);

        if (response) {
            dispatch({ type: 'LOADING_STATE_OFF' });

            dispatch({
                type: 'GET_MESSAGES',
                payload: { messages: response.data.data.messages },
            });
        }
    } catch (err) {
        dispatch({ type: 'LOADING_STATE_OFF' });
    }
};

export const sendMessage = (message: Message) => (dispatch: AppDispatch) => {
    dispatch({ type: 'SEND_MESSAGE', payload: { message } });
};
