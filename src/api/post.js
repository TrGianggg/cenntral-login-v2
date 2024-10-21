import axiosRequest from '@/helper/http/httpRequest'

export function newsFeedApi(query) {
  return axiosRequest({
    url: '/news-feed/home',
    method: 'get',
    data: query,
    isParams: true
  })
}

export function getPostApi(query) {
  return axiosRequest({
    url: '/post/detail',
    method: 'get',
    data: query,
    isParams: true
  })
}

export function myNewsFeedApi(query) {
  return axiosRequest({
    url: '/post/me',
    method: 'get',
    data: query,
    isParams: true
  })
}

export function userNewsFeedApi(query) {
    return axiosRequest({
        url: '/post/username',
        method: 'get',
        data: query,
        isParams: true,
    })
}

export function createPostApi(data) {
  return axiosRequest({
    url: '/post',
    method: 'post',
    data
  })
}

export function updatePostApi(data) {
  return axiosRequest({
    url: '/post/update',
    method: 'post',
    data
  })
}

export function getDetailPostApi(slug) {
  return axiosRequest({
    url: `/post/detail?slug=${slug}`,
    method: 'get'
  })
}

export function likePostApi(data) {
  return axiosRequest({
    url: `/like`,
    method: 'post',
    data
  })
}

export function dislikePostApi(data) {
  return axiosRequest({
    url: `/like/dislike`,
    method: 'post',
    data
  })
}

export function sharePostApi(data) {
  return axiosRequest({
    url: `/share`,
    method: 'post',
    data
  })
}

export function getCommentApi(query) {
  return axiosRequest({
    url: `/comment/slug`,
    method: 'get',
    data: query,
    isParams: true
  })
}

export function createCommentApi(data) {
  return axiosRequest({
    url: `/comment`,
    method: 'post',
    data: data
  })
}

export function uploadCommentApi(data) {
  return axiosRequest({
    url: `/comment/update`,
    method: 'post',
    data: data
  })
}

export function likeCommentApi(data) {
    return axiosRequest({
        url: `/like/comment`,
        method: 'post',
        data: data,
    })
}


export function dislikeCommentApi(data) {
    return axiosRequest({
        url: `/like/dislike-comment`,
        method: 'post',
        data: data,
    })
}

export function removeCommentApi(data) {
    return axiosRequest({
        url: `/comment/remove`,
        method: 'post',
        data: data,
    })
}

export function removePostApi(data) {
    return axiosRequest({
        url: `/post/remove`,
        method: 'post',
        data: data,
    })
}