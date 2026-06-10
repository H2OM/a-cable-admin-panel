import useAuth from "@hooks/useAuth.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {authAPI} from "@api";
import {Button, Card, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

export default function Login() {
    const {isAuthenticated, login} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if(isAuthenticated) navigate("/");
    }, [isAuthenticated]);

    const handleLogin = async (values: Record<string, string>) => {
        setLoading(true);

        const response = await authAPI.login(
            values.login,
            values.password,
        );

        setLoading(false);

        if(!response.success) {
            return;
        }

        login(response.data.token, response.data.user);
        navigate("/");
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Вход в панель управления" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Form name="login_form" onFinish={handleLogin} layout="vertical">
                    <Form.Item
                        name="login"
                        rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Логин" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}