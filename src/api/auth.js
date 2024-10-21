import axiosRequest from '@/helper/http/httpRequest'

export function loginApi(data) {
  return axiosRequest({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function changePasswordApi(data) {
  return axiosRequest({
    url: '/change-password',
    method: 'POST',
    data
  })
}

export function getUserInfo() {
  return axiosRequest({
    url: '/users/me',
    method: 'get'
  })
}

export function register(data) {
  return axiosRequest({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function resendOtp(data) {
  return axiosRequest({
    url: '/auth/register-resend-otp',
    method: 'post',
    data
  })
}

export function confirmOtp(data) {
  return axiosRequest({
    url: '/auth/register-confirm-otp',
    method: 'post',
    data
  })
}

export function gen2fa() {
  return axiosRequest({
    url: '/2fa/gen-2fa',
    method: 'post'
  })
}

export function changeStatus2fa(data) {
  return axiosRequest({
    url: '/2fa/on-off-2fa',
    method: 'post',
    data
  })
}

export function recognitionFaceApi(data) {
  return axiosRequest({
    url: '/users/kyc/gen-live',
    method: 'post',
    data
  })
}

export function uploadImageKyc(data) {
  return axiosRequest({
    url: '/users/kyc/upload-kyc',
    method: 'post',
    data,
    isUploadFile: true
  })
}

export function kycGenLiveApi() {
  return axiosRequest({
    url: '/users/kyc/gen-live',
    method: 'post'
  })
}

export function resetKycApi() {
  return axiosRequest({
    url: '/users/kyc/reset-kyc',
    method: 'post'
  })
}

export function identifyEmailApi(data) {
  return axiosRequest({
    url: '/auth/forgot-otp',
    method: 'post',
    data
  })
}

export function confirmOtpRecoverApi(data) {
  return axiosRequest({
    url: '/auth/forgot-confirm-otp',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return axiosRequest({
    url: '/auth/reset-password',
    method: 'post',
    data
  })
}

export function sentOtpChangePassApi() {
  return axiosRequest({
    url: '/users/change-password-otp',
    method: 'post'
  })
}

export function changePassword(data) {
  return axiosRequest({
    url: '/users/change-password',
    method: 'post',
    data
  })
}

export function logOutFn() {
  return axiosRequest({
    url: `/auth/logout`,
    method: 'post'
  })
}
