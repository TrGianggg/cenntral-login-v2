import axiosRequest from '@/helper/http/httpRequest'

export function addFriendApi(data) {
    return axiosRequest({
        url: '/friend',
        method: 'post',
        data
    })
}

export function getFriendsApi(query) {
    return axiosRequest({
        url: '/friend/me',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function getMyFriendsApi(query) {
    return axiosRequest({
        url: '/friend/me',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function getUserFriendsApi(query) {
    return axiosRequest({
        url: '/friend/user-name',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function acceptFriendsApi(data) {
    return axiosRequest({
        url: '/friend/accept',
        method: 'post',
        data: data,
    })
}
export function rejectFriendsApi(data) {
    return axiosRequest({
        url: '/friend/reject',
        method: 'post',
        data: data,
    })
}

export function unFriendsApi(data) {
    return axiosRequest({
        url: '/friend/unfriend',
        method: 'post',
        data: data,
    })
}

export function followUserApi(data) {
    return axiosRequest({
        url: '/follow',
        method: 'post',
        data: data,
    })
}

export function unFollowUserApi(data) {
    return axiosRequest({
        url: '/follow/un-follow',
        method: 'post',
        data: data,
    })
}

export function cancelInviteApi(data) {
    return axiosRequest({
        url: '/friend/cancel-invite',
        method: 'post',
        data: data,
    })
}
