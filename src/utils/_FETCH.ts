import {notification} from 'antd';
import {notificationConfig} from "@constants/notificationConfig.ts";
import {LoadingOutlined} from "@ant-design/icons";
import {createElement} from "react";

let token: string | null = null;

const setToken = (newToken: string | null) => {
    token = newToken;
}

const cleanRequest = async ({url, options = {method: "GET"}}: {
    url: string,
    options?: RequestInit,
    toasts?: boolean
}) => {
    return await fetch(url, options)
        .catch(() => {
            notification.error({
                title: 'Ошибка запроса!',
                ...notificationConfig
            });

            return false;
        });
}

const fileRequest = async ({url, options = {method: "GET"}, toasts = false}: {
    url: string,
    options?: RequestInit,
    toasts?: boolean

}) => {
    if(token) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    }

    const RESPONSE = await fetch(url, options);
    const blob = await RESPONSE.blob();

    if (!(blob instanceof Blob)) {
        notification.error({
            title: 'Ошибка запроса!',
            ...notificationConfig
        });

        return false;
    }

    if(toasts) {
        notification.success({
            title: 'Файл успешно получен!',
            ...notificationConfig
        });
    }

    const disposition = RESPONSE.headers.get('Content-Disposition');
    let filename = 'file.txt';

    if (disposition && disposition.includes('filename=')) {
        filename = disposition
            .split('filename=')[1]
            .split(';')[0]
            .replace(/['"]/g, '');

        filename = decodeURIComponent(filename);
    }

    return {blob, filename};
}

const request = async ({
    url,
    options = {
       method: "GET", headers: {
           "Content-Type": "application/json"
       }
    },
    toastSuccess = false,
    toastError = true
}: {
    url: string;
    options?: RequestInit;
    toastSuccess?: boolean | string;
    toastError?: boolean | string;
}) => {
    if(!(options.body instanceof FormData)) {
        options.headers = {
            ...options.headers,
            "Content-Type": "application/json"
        }
    }

    if(token) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    }

    return await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.success) {
                throw new Error(data.message ?? `Ошибка в получении данных с сервера!`);
            }

            if(toastSuccess) {
                notification.success({
                    title: typeof toastSuccess === 'string' ? toastSuccess : data.message ?? 'Успешно!',
                    ...notificationConfig
                });
            }

            return data;
        })
        .catch(error => {
            const MESSAGE = typeof toastError === 'string'
                ? toastError
                : (error instanceof Error && error.message === 'Failed to fetch'
                    ? "Ошибка соединения с сервером!"
                    : (error.message !== ''
                        ? error.message
                        : "Ошибка в получении данных!"));

            if(toastError) {
                notification.error({
                    title: MESSAGE,
                    ...notificationConfig
                });
            }

            return {success: false, message: MESSAGE};
        });
}

const progressTrackingRequest = async ({
    url,
    options = {method: "GET"},
    loading,
    success,
    error
}: {
    url: string;
    options?: RequestInit;
    loading?: string;
    success?: string;
    error?: string;
    json?: boolean;
}) => {
    if(!(options.body instanceof FormData)) {
        options.headers = {
            ...options.headers,
            "Content-Type": "application/json"
        }
    }

    if(token) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    }

    notification.open({
        ...notificationConfig,
        key: url,
        title: loading ?? 'Получение данных...',
        duration: 0,
        icon: createElement(LoadingOutlined)
    });

    return await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.success) throw new Error(data.message);

            notification.success({
                ...notificationConfig,
                key: url,
                title: success ?? data.message ?? 'Успешно!',
                duration: 3
            });

            return data;
        })
        .catch(e => {
            // TODO Если 401 открываем в новом окне форму входа, а лучше отдельное окно браузера

            notification.error({
                ...notificationConfig,
                key: url,
                title: error ?? e.message ?? 'Ошибка загрузки данных!',
                duration: 3
            });

            return {success: false, message: e.message}
        });
}

export default {setToken, progressTrackingRequest, request, cleanRequest, fileRequest};