import {Card, Checkbox, type CheckboxChangeEvent, List, Skeleton, Space, Spin, Typography} from "antd";
import SelectActions from "@components/ui/grid/SelectActions.tsx";
import ContextMenu from "@components/ui/grid/ContextMenu.tsx";
import {gridMenuItems} from "@constants/menuItems/gridMenuItems.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {EditOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import type {Order} from "@/types/orders.ts";
import {ordersAPI} from "@api";
import {orderGridMenuItems, ordersMenuItems} from "@constants/menuItems/ordersMenuItems.tsx";
import {orderStatusMap} from "@constants/orderStatusMap.ts";

export default function OrdersGrid() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [selectMode, setSelectMode] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);

    const fetchOrders = async () => {
        let total = count;

        setLoading(true);

        if (total === 0) {
            const countResponse = await ordersAPI.getCount();

            if (countResponse.success) {
                total = countResponse.data;

                setCount(total);
            }
        }

        const maxPage = total ? Math.ceil(total / limit) : 1;

        if (page > maxPage) {
            setSearchParams({
                page: String(maxPage),
                limit: String(limit),
            });

            setLoading(false);

            return;
        }

        const response = await ordersAPI.getAll(page, limit);

        setLoading(false);

        if (response.success) {
            setOrders(response.data);
        }
    };

    useEffect(() => {
        (() => void fetchOrders())();
    }, [page, limit]);

    const handlePageChange = (page: number, limit: number) => {
        setSearchParams({
            page: String(page),
            limit: String(limit),
        });
    };

    const deleteOrdersHandler = async (ids: number[]) => {
        setLoading(true);
        const response = await ordersAPI.deleteMany(ids);
        setLoading(false);

        if(response.success) {
            setOrders(prev => prev.filter(order => !ids.includes(order.id)));

            void fetchOrders();
        }

        return response;
    }

    const updateStatusHandler = async (ids: number[], status: string) => {
        setLoading(true);
        const response = await ordersAPI.updateStatus(ids, status);
        setLoading(false);

        if(response.success) {
            setOrders(prev  => prev.map(order => {
                if(ids.includes(order.id)) {
                    return {
                        ...order,
                        status: status
                    };
                }

                return order;
            }));
        }

        return response;
    }

    const selectedAction = async (
        callback: () => Promise<Record<string, string>>
    )=> {
        setLoading(true);
        const response = await callback();
        setLoading(false);

        if(response.success) {
            setSelected([]);
            setSelectMode(false);
        }
    }

    const contextUpdateStatusHandler = (status: string) => {
        void selectedAction(() => updateStatusHandler(selected, status));
    }

    const contextDeleteOrdersHandler = () => {
        void selectedAction(() => deleteOrdersHandler(selected));
    }

    return (
        <div>
            <Space style={{marginBottom: '30px', alignItems: "center"}}>
                <Typography.Title level={2} style={{margin: 0, marginBottom: '6px'}}>
                    Все заказы
                </Typography.Title>

                {selectMode ?
                    <SelectActions
                        selected={selected}
                        maxCount={orders.length}
                        checkAllHandler={(e: CheckboxChangeEvent) => {
                            setSelected(e.target.checked ? orders.map(order => order.id) : [])
                        }}
                        abortHandler={() => {
                            setSelected([]);
                            setSelectMode(false);
                        }}
                    >
                        <ContextMenu
                            menuItems={orderGridMenuItems}
                            handlers={{
                                status_in_progress: () => contextUpdateStatusHandler('0'),
                                status_in_delivery: () => contextUpdateStatusHandler('1'),
                                status_delivering: () => contextUpdateStatusHandler('2'),
                                status_ready: () => contextUpdateStatusHandler('3'),
                                status_finished: () => contextUpdateStatusHandler('4'),
                                delete: contextDeleteOrdersHandler
                            }}
                        />
                    </SelectActions>
                    :
                    <ContextMenu
                        menuItems={gridMenuItems}
                        handlers={{
                            select: () => setSelectMode(true)
                        }}
                    />
                }
            </Space>
            {loading && orders.length > 0 &&
                <div className="load-screen"><Spin size="large" description={"Загрузка..."} /></div>
            }
            <List
                grid={{gutter: ['10px', '10px'], xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1, xxxl: 1}}
                dataSource={loading && orders.length === 0
                    ? Array.from({length: limit}).map((_, i) => ({id: i} as Order))
                    : orders
                }
                itemLayout="horizontal"
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: count,
                    align: 'center',
                    showSizeChanger: true,
                    pageSizeOptions: ['30', '60', '100'],
                    onChange: handlePageChange
                }}
                renderItem={(order) => (
                    <List.Item style={{ margin: 0 }}>
                        {loading && orders.length === 0 ? (
                            <Card style={{width: '100%', height: '320px'}}>
                                <Skeleton active paragraph={{rows: 1}}/>
                            </Card>
                        ) : (
                            <Card style={{width: '100%'}}
                                  actions={[
                                      <Link to={`/orders/edit/${order.id}`}><EditOutlined key="edit" /></Link>,
                                      <ContextMenu
                                          menuItems={ordersMenuItems}
                                          handlers={{
                                              delete: () => deleteOrdersHandler([order.id]),
                                              status_in_progress: () => updateStatusHandler([order.id],'0'),
                                              status_in_delivery: () => updateStatusHandler([order.id],'1'),
                                              status_delivering: () => updateStatusHandler([order.id], '2'),
                                              status_ready: () => updateStatusHandler([order.id], '3'),
                                              status_finished: () => updateStatusHandler([order.id], '4'),
                                          }}
                                      />
                                  ]}
                            >
                                {selectMode &&
                                    <Checkbox
                                        className="checkbox _big"
                                        style={{position: "absolute", right: 10, top: 10}}
                                        checked={selected.includes(order.id)}
                                        onChange={({target}) => {
                                            setSelected(target.checked
                                                ? [...selected, order.id]
                                                : selected.filter(id => id !== order.id)
                                            );
                                        }}
                                    />
                                }
                                <p className="text-clamp" style={{margin: 0}}>
                                    <b>№ {order.number}</b>&nbsp;&nbsp;
                                    <span style={{color: 'var(--ant-color-icon)'}}>({order.id})</span>
                                </p>
                                <Space style={{justifyContent: "space-between"}}>
                                    <p className="text-clamp" style={{margin: 0}}>
                                        <b>
                                            {order.user.second_name} {order.user.first_name}
                                        </b>
                                        &nbsp;
                                        <span style={{color: 'var(--ant-color-icon)'}}>
                                            ({order.user.id})
                                        </span>
                                    </p>
                                    <span>|</span>
                                    <p style={{margin: 0, display: "flex", alignItems: "center"}}>
                                        <span>Статус:&nbsp;</span>
                                        <span
                                            className={"dot " + (
                                                ['0', '1'].includes(order.status) ? '_dark_orange'
                                                    : ['2', '3'].includes(order.status) ? '_orange'
                                                        : '_green'
                                            )}
                                            style={{margin: 0, marginTop: '1px'}}>
                                            {orderStatusMap[order.status as keyof typeof orderStatusMap]}
                                        </span>
                                    </p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>Кол-во товаров: {order.products.length}</p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>Дата оформления: {order.date}</p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>Дата обновления: {order.change_date}</p>
                                </Space>
                            </Card>
                        )}
                    </List.Item>
                )}
            />
        </div>
    );
}