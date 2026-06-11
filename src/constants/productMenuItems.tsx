import type {MenuProps} from "antd";
import {EditOutlined, DeleteOutlined, EyeOutlined, CopyOutlined} from "@ant-design/icons";

export const productMenuItems: MenuProps['items'] = [
    {
        key: 'view',
        label: 'Посмотреть на сайте',
        icon: <EyeOutlined />,
    },
    {
        key: 'duplicate',
        label: 'Дублировать товар',
        icon: <CopyOutlined />,
    },
    {
        key: 'edit',
        label: 'Редактировать',
        icon: <EditOutlined />,
    },
    {
        type: 'divider',
    },
    {
        key: 'delete',
        label: 'Удалить',
        icon: <DeleteOutlined />,
        danger: true,
    },
];