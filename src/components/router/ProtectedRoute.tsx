import {Navigate, Outlet} from "react-router-dom";
import useAuth from "@hooks/useAuth.ts";
import {useEffect} from "react";
import {notification} from "antd";
import {notificationConfig} from "@constants/notificationConfig.ts";

export default function ProtectedRoute({permission} : { permission: string }) {
    const {user, isPending} = useAuth();
    const isRightPermission = isPending || user?.permissions.find(perm => {
       return perm.code === '*' || perm.code === permission;
    });

    useEffect(() => {
        if(!isRightPermission) {
            notification.error({
                title: 'Недостаточно прав!',
                ...notificationConfig
            });
        }
    }, [isRightPermission]);

    return isRightPermission ? <Outlet /> : <Navigate to="/" replace />;
}