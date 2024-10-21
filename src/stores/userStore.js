import { defineStore } from 'pinia'
import { store } from './index.js'
import { getUserInfo, logOutFn } from '@/api/auth'
import { KEY_SUPPORT } from '@/stores/support'
import router from '@/router'

export const userStore = defineStore('userStore', {
  state: () => ({
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
    refresh: false
  }),
  getters: {
    checkPackageExpired(state) {
      const currentTime = new Date().getTime()
      return state.userInfo.expiredPremiumAt >= currentTime
    }
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    setRefresh(data) {
      console.log(data)
      this.refresh = data
    },
    async getUserInfo() {
      const { data } = await getUserInfo()

      this.setUserInfo(data)
      const oldUsername = localStorage.getItem('user_name')
      if (oldUsername !== data.username) {
        localStorage.setItem('user_name', data.username)
        const keysToDelete = Object.values(KEY_SUPPORT)
        keysToDelete.forEach(function (key) {
          localStorage.removeItem(key)
        })
      }

      return data
    },
    async logOut() {
      await logOutFn()
    }
  }
})

export function useUserStoreWithOut() {
  return userStore(store)
}
