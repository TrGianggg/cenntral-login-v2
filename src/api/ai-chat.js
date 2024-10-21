import axiosRequest from '@/helper/http/httpRequest'
const BASE_URL_AI = import.meta.env.VITE_BASE_API_URL_AI

export function getListMessagesApi(data) {
  return axiosRequest({
    url: '/ai-chat/messages',
    method: 'get',
    data,
    isParams: true
  })
}

export function getMessageReplyApi(data) {
  return axiosRequest({
    url: '/ai-chat/messages/reply',
    method: 'get',
    data,
    isParams: true
  })
}

export function sendMessageApi(data) {
  return axiosRequest({
    url: '/ai-chat/messages',
    method: 'post',
    data
  })
}
