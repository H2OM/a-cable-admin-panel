import {
    BarcodeOutlined,
    DashboardOutlined,
    DownloadOutlined,
    FilterOutlined,
    FormOutlined,
    PartitionOutlined,
    PicRightOutlined,
    ShoppingOutlined,
    SnippetsOutlined, TableOutlined, TeamOutlined, ThunderboltOutlined, UserOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import type {MenuItems} from "@/types/common.ts";

export const menuItems: MenuItems[] = [
    {
        key: '/',
        icon: <DashboardOutlined/>,
        label: <Link to="/">Главная панель</Link>,
    },
    {
        key: '/products-group',
        icon: <ShoppingOutlined/>,
        label: 'Товары',
        children: [
            {
                key: '/products',
                icon: <TableOutlined/>,
                label: <Link to="/products">Все товары</Link>,
            },
            {
                key: '/products/fast-actions',
                icon: <ThunderboltOutlined/>,
                label: <Link to="/products/fast-actions">Быстрые действия</Link>,
            }
        ]
    },
    {
        key: '/categories-group',
        icon: <PartitionOutlined/>,
        label: 'Категории',
        children: [
            {
                key: '/categories',
                icon: <TableOutlined/>,
                label: <Link to="/categories">Все категории</Link>,
            }
        ]
    },
    {
        key: '/filters-group',
        icon: <FilterOutlined/>,
        label: 'Фильтрация',
        children: [
            {
                key: '/filters',
                icon: <TableOutlined/>,
                label: <Link to="/filters">Все фильтры</Link>,
            }
        ]
    },
    {
        key: '/callbacks-group',
        icon: <FormOutlined/>,
        label: 'Формы обратной связи',
        children: [
            {
                key: '/callbacks',
                icon: <TableOutlined/>,
                label: <Link to="/callbacks">Все формы</Link>,
            }
        ]
    },
    {
        key: '/banners-group',
        icon: <PicRightOutlined/>,
        label: 'Баннеры',
        children: [
            {
                key: '/banners',
                icon: <TableOutlined/>,
                label: <Link to="/callbacks">Все баннеры</Link>,
            }
        ]
    },
    {
        key: '/parsers-group',
        icon: <DownloadOutlined/>,
        label: 'Парсеры товаров',
        children: [
            {
                key: '/parsers/anlan',
                icon: <DownloadOutlined/>,
                label: <Link to="/parsers/anlan">Выгрузка товаров AnLan</Link>,
            }
        ]
    },
    {
        key: '/orders-group',
        icon: <SnippetsOutlined/>,
        label: 'Заказы',
        children: [
            {
                key: '/orders',
                icon: <TableOutlined/>,
                label: <Link to="/orders">Все заказы</Link>,
            },
            {
                key: '/orders/delivery',
                icon: <SnippetsOutlined/>,
                label: <Link to="/orders/delivery">Способы доставки</Link>,
            }
        ]
    },
    {
        key: '/brands',
        icon: <BarcodeOutlined/>,
        label: <Link to="/brands">Бренды</Link>
    },
    {
        key: '/users',
        icon: <TeamOutlined/>,
        label: <Link to="/users">Учет пользователей</Link>
    },
    {
        key: '/admins',
        icon: <UserOutlined/>,
        label: <Link to="/admins">Учет администраторов</Link>
    },
];