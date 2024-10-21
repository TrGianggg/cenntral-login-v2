import axiosRequest from '@/helper/http/httpRequest'

export function ternaryTreeApi(query) {
    return axiosRequest({
        url: '/ternary-tree/my-list',
        method: 'get',
        data: query,
        isParams: true,
    })
}

export function ternaryTreeByUsernameApi(username) {
    return axiosRequest({
        url: `/ternary-tree/list?filters[username]=${username}`,
        method: 'get',
    })
}

export function getUserIncomeHistoryApi(query) {
    return axiosRequest({
        url: `/users/income-history`,
        method: 'get',
        data: query,
        isParams: true,
    })
}