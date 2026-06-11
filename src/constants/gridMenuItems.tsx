import {CheckSquareOutlined, DeleteOutlined, DislikeOutlined, StarOutlined, SwapOutlined} from "@ant-design/icons";
import type {ItemType} from "antd/es/menu/interface";
import {Popconfirm} from "antd";

export const gridMenuItems: ItemType[] = [
    {
        key: 'select',
        label: 'Выбрать несколько',
        icon:  <CheckSquareOutlined />,
    }
];

export const selectProductGridMenuItems: ItemType[] = [
    {
        key: 'pair_variant',
        label: 'Связывание',
        icon:  <SwapOutlined />,
    },
    {
        key: 'pair_related',
        label: 'Связывание как вариаций',
        icon:  <SwapOutlined />,
    },
    {
        type: 'divider',
    },
    {
        key: 'make_hit',
        label: 'Отметить как хит продаж',
        icon:  <StarOutlined />,
        style: {color: 'var(--star-color)'}
    },
    {
        key: 'exclude_hit',
        label: 'Снятие статуса хит продаж',
        icon:  <DislikeOutlined />,
        style: {color: 'var(--darked-star-color)'}
    },
    {
        type: 'divider',
    },
    {
        key: 'delete',
        label: (
            <Popconfirm title={'Удалить выбранные позиции?'} okText="Да" cancelText="Нет" placement={"right"}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '100%' }}
                >
                    Удалить
                </div>
            </Popconfirm>
        ),
        icon: <DeleteOutlined />,
        danger: true,
    }
];