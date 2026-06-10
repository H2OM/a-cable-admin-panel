import { Button, Card, List, Popconfirm, Skeleton, Typography} from "antd";
import {EditOutlined, EllipsisOutlined, DeleteOutlined, ExportOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import type {Product} from "@/types/products.ts";
import {productsAPI} from "@api";
import {useSearchParams} from "react-router-dom";

const IMAGES_URL = import.meta.env.VITE_PUBLIC_SITE_IMAGES_URL;

export default function ProductsTable() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    useEffect(() => {
        (async () => {
            let total = count;

            setLoading(true);

            if (total === 0) {
                const countResponse = await productsAPI.getCount();

                if (countResponse.success) {
                    total = countResponse.data;

                    setCount(total);
                }
            }

            const maxPage = Math.ceil(total / limit);

            if (page > maxPage) {
                setSearchParams({
                    page: String(maxPage),
                    limit: String(limit),
                });

                setLoading(false);

                return;
            }

            const response = await productsAPI.getAll(page, limit);

            setLoading(false);

            if (response.success) {
                setProducts(response.data);
            }
        })();
    }, [page, limit]);

    const handlePageChange = (page: number, limit: number) => {
        setSearchParams({
            page: String(page),
            limit: String(limit),
        });
    };

    return (
        <div>
            <Typography.Title level={2} style={{margin: 0, marginBottom: '30px'}}>
                Все товары
            </Typography.Title>
            <List
                grid={{gutter: [16, 24], xs: 1, sm: 2, md: 3, lg: 4}}
                dataSource={loading
                    ? Array.from({length: limit}).map((_, i) => ({id: i} as Product))
                    : products
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
                renderItem={(product) => (
                    <List.Item>
                        {loading ? (
                            <Card style={{width: 400, height: '320px'}}>
                                <Skeleton active paragraph={{rows: 3}}/>
                            </Card>
                        ) : (
                            <Card style={{ width: 400 }}
                                cover={
                                    <img
                                        draggable={false}
                                        alt={product.article}
                                        style={{height: 150, width: "auto", margin: "0 auto", padding: 5}}
                                        src={`${IMAGES_URL}/${product.image}`}
                                    />
                                }
                                actions={[
                                    <ExportOutlined key="link" />,
                                    <EditOutlined key="edit" />,
                                    <Popconfirm
                                        key="delete"
                                        title="Удалить товар?"
                                        onConfirm={() => console.log('Удален:', product.id)}
                                        okText="Да"
                                        cancelText="Нет"
                                    >
                                        <DeleteOutlined/>
                                    </Popconfirm>,
                                    <Button type="text" icon={<EllipsisOutlined key="ellipsis" />}/>,
                                ]}
                            >
                                <Card.Meta
                                    title={product.title}
                                />
                                <br/>
                                <Card.Meta
                                    title={product.price.toLocaleString('ru-RU', {
                                        style: 'currency',
                                        currency: 'RUB',
                                    })}
                                />
                                {product.price_old ?
                                    <p>
                                        Старая цена: {product.price_old.toLocaleString('ru-RU', {
                                            style: 'currency',
                                            currency: 'RUB',
                                        })}
                                    </p> : null
                                }
                                <p>Бренд: {product.brand}</p>
                                <p>Артикул: {product.article}</p>
                                <p>Категория: {product.category}</p>
                                <p>Хит: {product.hit ? 'Да' : 'Нет'}</p>
                                <p className={'stock' + (product.stock > 0 ? ' _in-stock' : ' _out-stock')}>
                                    Наличие: {product.stock} {product.unit}
                                </p>
                            </Card>
                        )}
                    </List.Item>
                )}
            />
        </div>
    );
}