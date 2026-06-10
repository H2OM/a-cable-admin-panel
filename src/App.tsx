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
import ProductsTable from "@pages/products/ProductsTable.tsx";

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
                                    <Route>
                                        <Route path={"/products"} element={<ProductsTable/>}/>
                                    </Route>
                                    <Route element={<ProtectedRoute permission={'products.edit'}/>}>
                                        <Route path={"/products/fast-actions"} element={<ProductsFastActions/>}/>
                                    </Route>
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