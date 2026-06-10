import {Layout, Menu} from 'antd';
import {useLocation} from "react-router-dom";
import useMenuItems from "@hooks/useMenuItems.ts";
import type {SubMenuType} from "antd/es/menu/interface";

export default function Side({collapsed}: { collapsed: boolean }) {
    const {menuItems, openKeys, setOpenKeys} = useMenuItems();
    const location = useLocation();

    return (
        <Layout.Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={400}
                      style={{boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'}}>
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: '0 24px',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: 'bold',
                fontSize: 18,
                color: 'var(--main-color)',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}>
                {collapsed ? 'X_C' : 'X_CABLE.PANEL'}
            </div>

            <Menu theme="light"
                  mode="inline"
                  selectedKeys={[location.pathname]}
                  openKeys={openKeys}
                  onOpenChange={(keys) => setOpenKeys(keys)}
                  items={menuItems as SubMenuType[]}
                  style={{borderRight: 0, marginTop: 16}}
            />
        </Layout.Sider>
    );
}