import { Button, Form, FormInstance, Input } from 'antd';
import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { checkLogin, loginUser } from '../../store/actions/authAction';
import { UserLoginInfo } from '../../types';
import Classes from './Login.module.css';

const Login: FC = (): ReactElement => {
    const [form]: [FormInstance<any>] = Form.useForm();
    const history = useHistory();

    const dispatch = useDispatch();

    // check if login
    useEffect(() => {
        dispatch(checkLogin(history, '/'));
    }, [dispatch, history]);

    // clear inputs on page load
    useEffect(() => {
        form.resetFields(['email', 'password']);
        return () => form.resetFields(['email', 'password']);
    }, [form]);

    // handle form submit
    const handleSubmit = async (values: UserLoginInfo): Promise<void> => {
        dispatch(loginUser(values, history, form));
    };

    return (
        <div className={Classes.wrapper}>
            <div className={Classes.loginForm}>
                <Form name="login_form" onFinish={handleSubmit} form={form}>
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
                        <Input className={Classes.inputField} placeholder="Email" autoFocus />
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
                            Login
                        </Button>
                        Or <Link to="/signup">Signup</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
