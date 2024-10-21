import axiosRequest from '@/helper/http/httpRequest'

export function getMasterDataApi() {
  return axiosRequest({
    url: '/master-data',
    method: 'get'
  })
}

export function getShareFund() {
  return axiosRequest({
    url: '/vault/info',
    method: 'get'
  })
}
