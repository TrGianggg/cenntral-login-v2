import axiosRequest from '@/helper/http/httpRequest'

export function setTokenOtpApi() {
  return axiosRequest({
    url: '/users/send-token-otp',
    method: 'post'
  })
}

export function setTokenApi(data) {
  return axiosRequest({
    url: '/users/send-token',
    method: 'post',
    data
  })
}

export function fetchDataAgencyApi(data) {
  return axiosRequest({
    url: '/agency/list',
    method: 'get',
    data,
    isParams: true
  })
}

export function fetchDataTransferApi(data) {
  return axiosRequest({
    url: '/users/wallet-history',
    method: 'get',
    data,
    isParams: true
  })
}

export function swapTomxuApi(data) {
  return axiosRequest({
    url: '/users/change-coin',
    method: 'post',
    data
  })
}
