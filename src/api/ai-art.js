import axiosRequest from '@/helper/http/httpRequest'
const BASE_URL_AI = import.meta.env.VITE_BASE_API_URL

export function getDataChooseOptionApi(data) {
  return axiosRequest({
    url: '/ai-art/properties',
    method: 'get',
    endPoint: BASE_URL_AI
  })
}

export function getInteractionsApi(data) {
  return axiosRequest({
    url: '/ai-art/interactions',
    method: 'get',
    data,
    isParams: true,
    endPoint: BASE_URL_AI
  })
}
export function postInteractionsApi(data) {
  return axiosRequest({
    url: '/ai-art/interactions',
    method: 'post',
    data,
    endPoint: BASE_URL_AI
  })
}
export function getInteractionsResultApi(data) {
  return axiosRequest({
    url: '/ai-art/interactions/result',
    method: 'get',
    data,
    isParams: true,
    endPoint: BASE_URL_AI
  })
}

export function cancelRequestApi(data) {
  return axiosRequest({
    url: '/ai-art/interactions/cancel',
    method: 'post',
    data,
    endPoint: BASE_URL_AI
  })
}

export function midjourneyInteractionsApi(data) {
  return axiosRequest({
    url: '/ai-art/interactions/cancel',
    method: 'post',
    data,
    endPoint: BASE_URL_AI
  })
}
