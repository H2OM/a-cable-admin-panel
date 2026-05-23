import {Button, Form, Input, InputNumber, Select} from "antd";
import {useEffect, useState} from "react";
import {BarcodeOutlined, DownloadOutlined, NumberOutlined, UploadOutlined} from '@ant-design/icons';
import {parserAPI, categoriesAPI} from "@api";
import type {Category} from "@/types/categories.ts";
import {Typography} from "antd";
import type {AnlanParser} from "@/types/parsers.ts";

export default function Parser() {
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const response = await categoriesAPI.getAll();

            setLoading(false);

            if (response.success) {
                setCategories(response.data);
            }
        })();
    }, [])

    const handleSubmit = async (value: AnlanParser) => {
        setLoading(true);

        const response = await parserAPI.fromAnlan(value);

        setLoading(false);
    }

    return (
        <div>
            <Typography.Title level={2} style={{margin: 0, marginBottom: '30px'}}>
                Выгрузка товаров с сайта АнЛан
            </Typography.Title>
            <Form name="parser" onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    name="brand_id"
                    label={'id бренда'}
                    rules={[{required: true, message: 'Введите id бренда!'}]}
                >
                    <InputNumber prefix={<BarcodeOutlined/>} style={{width: '100%'}} size="large"/>
                </Form.Item>
                <Form.Item
                    name="limit"
                    label={'Лимит выгрузки'}
                    rules={[{required: true, message: 'Лимит загрузки должен быть больше 0'}]}
                >
                    <InputNumber prefix={<NumberOutlined/>} style={{width: '100%'}} size="large"/>
                </Form.Item>

                {/*TODO Подгружать категории*/}
                <Form.Item
                    name="categories_codes"
                    label={'Из категорий:'}
                    rules={[{required: true, message: 'Введите хотя бы одну категорию'}]}
                >
                    <Select
                        prefix={<UploadOutlined />}
                        size={"large"}
                        mode={"tags"}
                        style={{width: '100%'}}
                    />
                </Form.Item>
                <Form.Item
                    name="deploy_category_id"
                    label={'Загрузить в категорию:'}
                    rules={[{required: true, message: 'Выберите категорию'}]}
                >
                    <Select
                        prefix={<DownloadOutlined />}
                        size={"large"}
                        style={{width: '100%'}}
                        options={categories.flatMap(category =>
                            category.types.map(type => ({
                                value: type.id,
                                label: type.name
                            }))
                        )}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                        Подтвердить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}