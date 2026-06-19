import {useState} from 'react';
import {Layout, Avatar, Dropdown, Space, Button} from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import {Outlet} from 'react-router-dom';
import useAuth from "@hooks/useAuth.ts";
import Side from "@components/layout/Side.tsx";

const {Header, Content, Footer} = Layout;

export default function MainLayout() {
    const {user, logout} = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const profileMenu = {
        items: [
            {
                key: 'email',
                label: <span style={{color: '#8c8c8c'}}>{user?.email}</span>,
                disabled: true,
            },
            {
                key: 'logout',
                label: 'Выйти',
                icon: <LogoutOutlined/>,
                danger: true,
                onClick: logout,
            },
        ],
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Side collapsed={collapsed}/>
            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--base-shadow)',
                    zIndex: 1
                }}>
                    <Button type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{fontSize: '16px', width: 64, height: 64}}
                    />
                    <Dropdown menu={profileMenu} placement="bottomRight" trigger={['click']}>
                        <Space style={{cursor: 'pointer', padding: '0 8px'}}>
                            <Avatar icon={<UserOutlined/>} style={{backgroundColor: 'var(--main-color)'}}/>
                            <span style={{fontWeight: 500}}>{user?.name}</span>
                        </Space>
                    </Dropdown>
                </Header>

                <Content
                    style={{margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8, minHeight: 280}}>
                    <Outlet/>
                </Content>

                <Footer style={{
                    textAlign: 'center',
                    background: '#fff',
                    boxShadow: 'var(--base-shadow)',
                    padding: '16px 50px'
                }}>
                    a_cable Админ Панель ©{new Date().getFullYear()} Разработана в рамках выпускной квалификационной работы
                </Footer>
            </Layout>
        </Layout>
    );
}
