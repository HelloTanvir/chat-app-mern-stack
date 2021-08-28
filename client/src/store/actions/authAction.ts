/* eslint-disable no-param-reassign */
import { FormInstance } from 'antd';
import { AxiosResponse } from 'axios';
import uploadImg from '../../assets/images/Profile_avatar_placeholder_large.png';
import { AppHistory, User, UserLoginInfo } from '../../types';
import axios from '../../utils/axios';
import { AppDispatch } from '../store';

export const checkLogin =
    (history: AppHistory, onFailRoute: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch({ type: 'LOADING_STATE_ON' });

            const response: AxiosResponse<any> = await axios.get('/auth/checklogin');

            if (response) {
                dispatch({ type: 'LOADING_STATE_OFF' });

                dispatch({ type: 'LOGIN_USER', payload: { user: response.data.data } });

                history.push('/chat');
            }
        } catch (err) {
            dispatch({ type: 'LOADING_STATE_OFF' });

            dispatch({ type: 'LOGOUT_USER' });

            history.push(onFailRoute);
        }
    };

export const signupUser =
    (
        userData: User,
        history: AppHistory,
        form: FormInstance<any>,
        selectedImg: HTMLInputElement,
        previewImgLink: HTMLImageElement
    ) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch({ type: 'LOADING_STATE_ON' });

            const data: FormData = new FormData();

            data.append('name', userData.name);
            data.append('email', userData.email);
            data.append('mobile', userData.mobile);
            data.append('password', userData.password);
            data.append('image', userData.image);

            const response: AxiosResponse<any> = await axios.post('/auth/signup', data);

            if (response) {
                dispatch({ type: 'LOADING_STATE_OFF' });

                dispatch({ type: 'LOGIN_USER', payload: { user: response.data.data } });

                history.push('/chat');
            }
        } catch (error) {
            const err: any = error;

            dispatch({ type: 'LOADING_STATE_OFF' });

            dispatch({ type: 'LOGOUT_USER' });

            if (err.response?.data?.errors?.image?.msg) {
                selectedImg.files = null;
                previewImgLink.src = uploadImg;
            }

            form.setFields([
                {
                    name: 'name',
                    errors: [err.response?.data?.errors?.name?.msg || ''],
                },
                {
                    name: 'email',
                    errors: [
                        err.response?.data?.errors?.email?.msg ||
                            err.response?.data?.errors?.common?.msg ||
                            '',
                    ],
                },
                {
                    name: 'mobile',
                    errors: [err.response?.data?.errors?.mobile?.msg || ''],
                },
                {
                    name: 'image',
                    errors: [err.response?.data?.errors?.image?.msg || ''],
                },
                {
                    name: 'password',
                    errors: [err.response?.data?.errors?.password?.msg || ''],
                },
            ]);
        }
    };

export const loginUser =
    (userData: UserLoginInfo, history: AppHistory, form: FormInstance<any>) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch({ type: 'LOADING_STATE_ON' });

            const response: AxiosResponse<any> = await axios.post('/auth/login', userData);

            if (response) {
                dispatch({ type: 'LOADING_STATE_OFF' });

                dispatch({ type: 'LOGIN_USER', payload: { user: response.data.data } });

                history.push('/chat');
            }
        } catch (error) {
            const err: any = error;

            dispatch({ type: 'LOADING_STATE_OFF' });

            dispatch({ type: 'LOGOUT_USER' });

            form.setFields([
                {
                    name: 'email',
                    errors: [
                        err.response?.data?.errors?.email?.msg ||
                            err.response?.data?.errors?.common?.msg ||
                            '',
                    ],
                },
                {
                    name: 'password',
                    errors: [err.response?.data?.errors?.password?.msg || ''],
                },
            ]);
        }
    };

export const logoutUser = (history: AppHistory) => async (dispatch: AppDispatch) => {
    try {
        dispatch({ type: 'LOADING_STATE_ON' });

        const response: AxiosResponse<any> = await axios.get('/auth/logout');

        if (response) {
            dispatch({ type: 'LOADING_STATE_OFF' });

            dispatch({
                type: 'SELECT_CONVERSATION',
                payload: {
                    conversation: {
                        _id: '',
                        creator: { id: '', name: '', email: '', image: '' },
                        participant: { id: '', name: '', email: '', image: '' },
                        last_updated: '',
                    },
                },
            });
            dispatch({ type: 'LOGOUT_USER' });

            history.push('/');
        }
    } catch (err) {
        history.push('/');
    }
};
