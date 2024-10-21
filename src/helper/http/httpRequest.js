import axios from 'axios'
import { message } from 'ant-design-vue'
import { getToken, getTokenAuth } from '@/helper/http/cookie'
import { logOut } from '@/helper'
import router from '@/router'
const service = axios.create({
  // timeout: 20000,
  headers: {
    'Accept-Language': 'vi'
  }
})
const AUTH_ROUTE = ['register-form', 'register', 'validate-email', 'register-2fa', 'register-kyc']
let reqConfig
service.interceptors.request.use(
  (config) => {
    if (AUTH_ROUTE.includes(router.currentRoute.value.name)) {
      if (getTokenAuth()) {
        config.headers.Authorization = 'Bearer ' + getTokenAuth()
      }
    } else {
      if (getToken()) {
        config.headers.Authorization = 'Bearer ' + getToken()
      }
    }
    if (config.isDownLoadFile) {
      config.responseType = 'blob'
    }
    if (config.isUploadFile) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    reqConfig = config
    if (config.isParams) {
      config.params = config.data
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  async (response) => {
    let res = response.data
    if (reqConfig.isDownLoadFile) {
      return response
    }
    const statusCode = response.status
    switch (statusCode) {
      case 200:
        break
      case 201:
        break
      case 422:
        res = {
          ...res,
          error_response: ''
        }
        break
      default:
    }
    if (statusCode === 200 || statusCode === 201 || statusCode === 422 || statusCode === 401) {
      if (reqConfig.isAlertErrorMsg && statusCode === 200) {
        // console.log('200 message')
      }
      return res
    } else {
      if (reqConfig.isAlertErrorMsg) {
        // console.log('message error')
      }
      if (statusCode.toString().startsWith('5')) {
        // console.log('message error 500')
      }
      return Promise.reject(new Error(res.message || 'error'))
    }
  },
  async (error) => {
    const statusCode = error.response?.status
    const message = error?.response?.data?.error?.message
    switch (statusCode) {
      case 403:
        if (getToken()) {
          await router.push({
            name: 'feed'
          })
        } else {
          await router.push({
            name: 'login'
          })
        }
        break
      case 429:
        logOut()
        break
      case 401:
        const messageRequest = error?.response?.data?.error
        if (messageRequest?.errorName?.includes('UnauthorizedException')) {
          if (!messageRequest.message.includes('bị tạm khóa')) {
            logOut()
          }
        }
        break
      case 500:
        return Promise.reject(error.response?.data?.error)
      default:
    }
    return Promise.reject(error.response?.data?.error)
  }
)
//
export function axiosRequest({
  url,
  method,
  data,
  isParams,
  recaptcha,
  isQuery,
  isUploadFile,
  isDownLoadFile,
  isAlertErrorMsg = true,
  endPoint,
  withCredentials = false
}) {
  return service({
    baseURL: endPoint ?? import.meta.env.VITE_BASE_API_URL,
    url,
    method: method ?? 'get',
    recaptcha: recaptcha ?? '',
    data: data ?? {},
    isQuery: isQuery ?? false,
    isParams: isParams ?? false,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg,
    withCredentials: withCredentials,
    headers: {
      'Accept-Language': 'vi',
      recaptcha: recaptcha
    }
  })
}

export default axiosRequest
