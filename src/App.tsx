import './styles/global.scss';
import {ConfigProvider} from "antd";
import ruRU from 'antd/locale/ru_RU';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthProtector from "@components/router/AuthProtector.tsx";
import Login from "@pages/Login.tsx";
import Main from "@pages/Main.tsx";
import {AuthProvider} from "@providers/AuthProvider.tsx";
import MainLayout from "@layouts/MainLayout.tsx";
import ParserAnlan from "@pages/parsers/ParserAnlan.tsx";
import ProductsFastActions from "@pages/products/ProductsFastActions.tsx";
import ProtectedRoute from "@components/router/ProtectedRoute.tsx";
import ProductsGrid from "@pages/products/ProductsGrid.tsx";
import ProductAdd from "@pages/products/ProductAdd.tsx";
import ProductEdit from "@pages/products/ProductEdit.tsx";
import BrandsGrid from "@pages/brands/BrandsGrid.tsx";
import OrdersGrid from "@pages/orders/OrdersGrid.tsx";
import CategoriesGrid from "@pages/categories/CategoriesGrid.tsx";
import FiltersGrid from "@pages/filters/FiltersGrid.tsx";
import BannersGrid from "@pages/banners/BannersGrid.tsx";
import CallbacksGrid from "@pages/callbacks/callbacksGrid.tsx";

export default function App() {
    return (
        <ConfigProvider locale={ruRU}>
            <AuthProvider>
                <BrowserRouter>
                    {/* Публичные маршруты */}
                    <Routes>
                        <Route path="/login" element={<Login/>}/>

                        {/* Защищенные маршруты */}
                        <Route element={<AuthProtector/>}>
                            <Route element={<MainLayout/>}>
                                <Route path={"/"} element={<Main/>}/>
                                <Route element={<ProtectedRoute permission={'products'}/>}>
                                    <Route path={"/products"} element={<ProductsGrid/>}/>
                                    <Route element={<ProtectedRoute permission={'products.add'}/>}>
                                        <Route path={"/products/add/"} element={<ProductAdd/>}/>
                                    </Route>
                                    <Route element={<ProtectedRoute permission={'products.edit'}/>}>
                                        <Route path={"/products/edit/:id"} element={<ProductEdit/>}/>
                                        <Route path={"/products/fast-actions"} element={<ProductsFastActions/>}/>
                                    </Route>
                                </Route>
                                <Route element={<ProtectedRoute permission={'categories'}/>}>
                                    <Route path={"/categories"} element={<CategoriesGrid/>}/>
                                </Route>
                                <Route element={<ProtectedRoute permission={'filters'}/>}>
                                    <Route path={"/filters"} element={<FiltersGrid/>}/>
                                </Route>
                                <Route element={<ProtectedRoute permission={'orders'}/>}>
                                    <Route path={"/orders"} element={<OrdersGrid/>}/>
                                </Route>
                                <Route element={<ProtectedRoute permission={'brands'}/>}>
                                    <Route path={"/brands"} element={<BrandsGrid/>}/>
                                </Route>
                                <Route element={<ProtectedRoute permission={'callbacks'}/>}>
                                    <Route path={"/callbacks"} element={<CallbacksGrid/>}/>
                                </Route>
                                <Route element={<ProtectedRoute permission={'banners'}/>}>
                                    <Route path={"/banners"} element={<BannersGrid/>}/>
                                </Route>
                                <Route element={<ProtectedRoute permission={'parsers'}/>}>
                                    <Route path={"/parsers/anlan"} element={<ParserAnlan/>}/>
                                </Route>
                            </Route>
                        </Route>

                        {/* Редирект по умолчанию TODO на 404 */}
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ConfigProvider>
    );
}