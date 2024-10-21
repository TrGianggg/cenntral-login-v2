import axiosRequest from '@/helper/http/httpRequest'

export function getNotificationApi(query) {
    return axiosRequest({
        url: '/notification/me',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function readAllNotificationApi() {
    return axiosRequest({
        url: '/notification/read-all',
        method: 'post',
    })
}

export function updateNotificationApi(data) {
    return axiosRequest({
        url: '/notification/update',
        method: 'post',
        data
    })
}

export function removeNotificationApi(data) {
    return axiosRequest({
        url: '/notification/remove',
        method: 'post',
        data
    })
}

export function countNotificationApi() {
    return axiosRequest({
        url: '/notification/count',
        method: 'get',
    })
}

export function getConfigStatusNotificationApi() {
    return axiosRequest({
        url: '/notification/status',
        method: 'get',
    })
}

export function updateConfigStatusNotificationApi(data) {
    return axiosRequest({
        url: '/notification/on-off',
        method: 'post',
        data
    })
}