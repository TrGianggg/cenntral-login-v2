import { defineStore } from 'pinia'
import { store } from './index.js'

export const TYPE_SESSIONSTORAGE_AUTH = {
  EMAIL_AUTH: 'email_auth',
  DATA_REGISTER_SUCCESS: 'data_register_success'
}
export const SESSION_RECOVER_KEY = 'data_recover'
export const authStore = defineStore('authStore', {
  state: () => ({}),
  actions: {}
})

export function useAppStoreWithOut() {
  return authStore(store)
}
