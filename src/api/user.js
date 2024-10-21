import axiosRequest from '@/helper/http/httpRequest'
const VITE_BASE_SHOP_API_URL = import.meta.env.VITE_BASE_SHOP_API_URL

export function updateImage(data) {
  return axiosRequest({
    url: '/users/upload-image',
    method: 'post',
    data: data
  })
}

export function getUserDetailApi(username) {
  return axiosRequest({
    url: `/users/byUsername?username=${username}`,
    method: 'get'
  })
}

export function updateIntroduceApi(data) {
  return axiosRequest({
    url: `/users/introduce`,
    method: 'post',
    data
  })
}

export function updateClientIdApi(data) {
  return axiosRequest({
    url: `/users/firebase`,
    method: 'post',
    data
  })
}

export function updateInfoUser(data) {
  return axiosRequest({
    url: `/users/information`,
    method: 'post',
    data
  })
}

export function checkinUser() {
  return axiosRequest({
    url: `/users/checkIn`,
    method: 'post'
  })
}

export function getIdToken2(data) {
  return axiosRequest({
    url: `/check-token`,
    method: 'post',
    endPoint: VITE_BASE_SHOP_API_URL,
    data
  })
}
