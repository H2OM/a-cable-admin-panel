import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {callbacksAPI} from "@api";
import {Card, Checkbox, type CheckboxChangeEvent, List, Skeleton, Space, Spin, Typography} from "antd";
import SelectActions from "@components/ui/grid/SelectActions.tsx";
import ContextMenu from "@components/ui/grid/ContextMenu.tsx";
import {filterMenuItems, filtersGridMenuItems} from "@constants/menuItems/filtersMenuItems.tsx";
import {gridMenuItems} from "@constants/menuItems/gridMenuItems.tsx";
import {EditOutlined} from "@ant-design/icons";
import type {Callback} from "@/types/callbacks.ts";
import {callbackStatusMap} from "@constants/callbackStatusMap.ts";

export default function CallbacksGrid() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const [items, setItems] = useState<Callback[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [selectMode, setSelectMode] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);

    const fetchItems = async () => {
        let total = count;

        setLoading(true);

        if (total === 0) {
            const countResponse = await callbacksAPI.getCount();

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

        const response = await callbacksAPI.getAll(page, limit);

        setLoading(false);

        if (response.success) {
            setItems(response.data);
        }
    };

    useEffect(() => {
        (() => void fetchItems())();
    }, [page, limit]);

    const handlePageChange = (page: number, limit: number) => {
        setSearchParams({
            page: String(page),
            limit: String(limit),
        });
    };

    const deleteItemsHandler = async (ids: number[]) => {
        setLoading(true);
        const response = await callbacksAPI.deleteMany(ids);
        setLoading(false);

        if (response.success) {
            setItems(prev => prev.filter(item => !ids.includes(item.id)));

            void fetchItems();
        }

        return response;
    }

    const selectedAction = async (
        callback: () => Promise<Record<string, string>>
    ) => {
        setLoading(true);
        const response = await callback();
        setLoading(false);

        if (response.success) {
            setSelected([]);
            setSelectMode(false);
        }
    }

    const contextDeleteItemsHandler = () => {
        void selectedAction(() => deleteItemsHandler(selected));
    }

    return (
        <div>
            <Space style={{marginBottom: '30px', alignItems: "center"}}>
                <Typography.Title level={2} style={{margin: 0, marginBottom: '6px'}}>
                    Все запросы обратной связи
                </Typography.Title>

                {selectMode ?
                    <SelectActions
                        selected={selected}
                        maxCount={items.length}
                        checkAllHandler={(e: CheckboxChangeEvent) => {
                            setSelected(e.target.checked ? items.map(item => item.id) : [])
                        }}
                        abortHandler={() => {
                            setSelected([]);
                            setSelectMode(false);
                        }}
                    >
                        <ContextMenu
                            menuItems={filtersGridMenuItems}
                            handlers={{
                                delete: contextDeleteItemsHandler
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
            {loading && items.length > 0 &&
                <div className="load-screen"><Spin size="large" description={"Загрузка..."}/></div>
            }
            <List
                grid={{gutter: ['10px', '10px'], xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1, xxxl: 1}}
                dataSource={loading && items.length === 0
                    ? Array.from({length: limit}).map((_, i) => ({id: i} as Callback))
                    : items
                }
                itemLayout="horizontal"
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: count,
                    align: 'center',
                    showSizeChanger: true,
                    pageSizeOptions: ['15', '30', '60', '90'],
                    onChange: handlePageChange
                }}
                renderItem={(item) => (
                    <List.Item style={{margin: 0}}>
                        {loading && items.length === 0 ? (
                            <Card style={{width: '100%', height: '320px'}}>
                                <Skeleton active paragraph={{rows: 1}}/>
                            </Card>
                        ) : (
                            <Card style={{width: '100%'}}
                                  actions={[
                                      <Link to={`/callbacks/edit/${item.id}`}><EditOutlined key="edit"/></Link>,
                                      <ContextMenu
                                          menuItems={filterMenuItems}
                                          handlers={{
                                              delete: () => deleteItemsHandler([item.id]),
                                          }}
                                      />
                                  ]}
                            >
                                {selectMode &&
                                    <Checkbox
                                        className="checkbox _big"
                                        style={{position: "absolute", right: 10, top: 10}}
                                        checked={selected.includes(item.id)}
                                        onChange={({target}) => {
                                            setSelected(target.checked
                                                ? [...selected, item.id]
                                                : selected.filter(id => id !== item.id)
                                            );
                                        }}
                                    />
                                }
                                <p className="text-clamp" style={{margin: 0}}>
                                    <b>{item.title}</b>&nbsp;&nbsp;
                                    <span style={{color: 'var(--ant-color-icon)'}}>({item.id})</span>
                                </p>
                                <Space style={{justifyContent: "space-between"}}>
                                    <p className="text-clamp" style={{margin: 0}}>
                                        {item.user &&
                                            <>
                                                <b>
                                                    {item.user.second_name} {item.user.first_name}
                                                </b>
                                                &nbsp;
                                                <span style={{color: 'var(--ant-color-icon)'}}>
                                                    ({item.user.id})
                                                </span>
                                            </>
                                        }
                                    </p>
                                    <span>|</span>
                                    <p style={{margin: 0, display: "flex", alignItems: "center"}}>
                                        <span>Статус:&nbsp;</span>
                                        <span
                                            className={"dot " + (
                                                item.status === '0' ? '_dark_orange'
                                                    : item.status === '1' ? '_orange'
                                                        : '_green'
                                            )}
                                            style={{margin: 0, marginTop: '1px'}}>
                                            {callbackStatusMap[item.status as keyof typeof callbackStatusMap]}
                                        </span>
                                    </p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>От: {item.email}</p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>
                                        Сообщение: {item.message.length > 20
                                            ? (item.message.substring(0, 20) + '...')
                                            : item.message
                                        }
                                    </p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>Дата создания: {item.date}</p>
                                    <span>|</span>
                                    <p className="text-clamp" style={{margin: 0}}>Дата обновления: {item.update_date}</p>
                                </Space>
                            </Card>
                        )}
                    </List.Item>
                )}
            />
        </div>
    );
}