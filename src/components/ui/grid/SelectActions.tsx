import {Button, Checkbox, type CheckboxChangeEvent, Space} from "antd";
import {CloseOutlined} from "@ant-design/icons"
import type {MouseEvent, ReactNode} from "react";

export default function SelectActions({
    children,
    selected,
    maxCount,
    checkAllHandler,
    abortHandler,
}: {
    children?: ReactNode;
    selected: number[];
    maxCount: number;
    checkAllHandler: (e: CheckboxChangeEvent) => void;
    abortHandler: (e?: MouseEvent<HTMLElement>) => void;
    deleteHandler: () => void;
}) {
    const checkAll = maxCount === selected.length;
    const indeterminate = selected.length > 0 && selected.length < maxCount;

    return (
        <Space>
            {children}
            <Checkbox indeterminate={indeterminate} onChange={checkAllHandler} checked={checkAll}>
                Выбрать все
            </Checkbox>
            <Button color={"danger"} variant={"text"} icon={<CloseOutlined/>} onClick={abortHandler}>
                Отменить
            </Button>
        </Space>
    );
}