import axiosRequest from '@/helper/http/httpRequest'

export function getPackageApi() {
  return axiosRequest({
    url: '/users/packages',
    method: 'get'
  })
}

export function buyPackageApi(data) {
  return axiosRequest({
    url: '/users/buy-packages',
    method: 'post',
    data
  })
}
