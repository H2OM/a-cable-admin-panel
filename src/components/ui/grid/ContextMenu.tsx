import {Button, Dropdown} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";
import type {ItemType} from "antd/es/menu/interface";

export default function ContextMenu({menuItems, handlers}: {
    menuItems: ItemType[];
    handlers: Record<string, () => void>
}) {
    return (
        <Dropdown
            menu={{items: menuItems, onClick: e => handlers[e.key] && handlers[e.key]()}}
            trigger={['click']}
            placement={"bottomLeft"}
        >
            <Button
                variant="text"
                color="default"

                onClick={e => e.stopPropagation()}
                icon={<EllipsisOutlined style={{ fontSize: '18px' }}/>}
            />
        </Dropdown>
    );
}