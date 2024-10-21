import axiosRequest from '@/helper/http/httpRequest'

export function getCountMessageApi(query) {
    return axiosRequest({
        url: '/message/count-new',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function getMessageApi(query) {
    return axiosRequest({
        url: '/message/slug',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function createMessageApi(data) {
    return axiosRequest({
        url: '/message/create-message',
        method: 'post',
        data,
    })
}

export function seenMessagesApi(data) {
    return axiosRequest({
        url: '/message/seen',
        method: 'post',
        data,
    })
}

export function getRoomsApi(query) {
    return axiosRequest({
        url: '/room/me',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function getRoomDetailApi(query) {
    return axiosRequest({
        url: '/room/detail',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function createRoomApi(data) {
    return axiosRequest({
        url: '/room',
        method: 'post',
        data,
    })
}

export function updateRoomApi(data) {
    return axiosRequest({
        url: '/room/update',
        method: 'post',
        data,
    })
}

export function changeMasterRoomApi(data) {
    return axiosRequest({
        url: '/room/change-master',
        method: 'post',
        data,
    })
}

export function removeRoomApi(data) {
    return axiosRequest({
        url: '/room/remove',
        method: 'post',
        data,
    })
}

export function addRoomMemberApi(data) {
    return axiosRequest({
        url: '/room/add-member',
        method: 'post',
        data,
    })
}

export function getRoomMemberApi(query) {
    return axiosRequest({
        url: '/room/member',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function getRoomMemberRecommendApi(query) {
    return axiosRequest({
        url: '/room/member-recommend',
        method: 'get',
        data: query,
        isParams: true
    })
}

export function removeRoomMemberApi(data) {
    return axiosRequest({
        url: '/room/remove-member',
        method: 'post',
        data,
    })
}

export function getChatBackgroundApi() {
    return axiosRequest({
        url: '/list-background',
        method: 'get',
    })
}