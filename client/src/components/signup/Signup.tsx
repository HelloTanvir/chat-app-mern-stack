/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Form, FormInstance, Input } from 'antd';
import React, { FC, ReactElement, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import uploadImg from '../../assets/images/Profile_avatar_placeholder_large.png';
import { checkLogin, signupUser } from '../../store/actions/authAction';
import { User } from '../../types';
import Classes from './Signup.module.css';

const Signup: FC = (): ReactElement => {
    const [form]: [FormInstance<any>] = Form.useForm();
    const history = useHistory();

    const dispatch = useDispatch();

    const profilePictureRef = useRef<HTMLInputElement>(null);
    const previewProfilePictureRef = useRef<HTMLImageElement>(null);

    // check if login
    useEffect(() => {
        dispatch(checkLogin(history, '/signup'));
    }, [dispatch, history]);

    // clear inputs on page load
    useEffect(() => {
        form.resetFields(['name', 'email', 'mobile', 'image', 'password']);
        return () => form.resetFields(['name', 'email', 'mobile', 'image', 'password']);
    }, [form]);

    // handler for previewing profile image before upload
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let selectedFile: File;

        if (e.currentTarget.files?.length) {
            [selectedFile] = Array.from(e.currentTarget.files);
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = () => {
                if (reader.result && previewProfilePictureRef.current) {
                    previewProfilePictureRef.current.src = reader.result.toString();
                }
            };
        }
    };

    // handle form submit
    const handleSubmit = async (values: User): Promise<void> => {
        if (
            profilePictureRef.current &&
            profilePictureRef.current.files &&
            previewProfilePictureRef.current
        ) {
            dispatch(
                signupUser(
                    { ...values, image: profilePictureRef.current.files[0] },
                    history,
                    form,
                    profilePictureRef.current,
                    previewProfilePictureRef.current
                )
            );
        }
    };

    return (
        <div className={Classes.wrapper}>
            <div className={Classes.signupForm}>
                <Form name="signup_form" onFinish={handleSubmit} form={form}>
                    <Form.Item name="image">
                        <label className={Classes.profilePicture}>
                            <input
                                type="file"
                                ref={profilePictureRef}
                                onChange={handleProfilePictureChange}
                            />
                            <span>Profile picture</span>
                            <img
                                src={uploadImg}
                                ref={previewProfilePictureRef}
                                alt="User Profile"
                            />
                        </label>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Name!',
                            },
                        ]}
                    >
                        <Input className={Classes.inputField} placeholder="Name" autoFocus />
                    </Form.Item>

                    <Form.Item
                        name="mobile"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Mobile Number!',
                            },
                        ]}
                    >
                        <Input className={Classes.inputField} placeholder="Mobile Number" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                            {
                                type: 'email',
                                message: 'The input is not valid email',
                            },
                        ]}
                    >
                        <Input className={Classes.inputField} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            className={Classes.inputField}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                            Signup
                        </Button>
                        Or <Link to="/">Login</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
