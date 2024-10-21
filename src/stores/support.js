import { defineStore } from 'pinia'
import { store } from './index.js'

export const KEY_SUPPORT = {
  KYC: 'kyc',
  REFCODE: 'ref-code',
  CHANGEPASS: 'change-password',
  TRANSACTIONTOMXU: 'transaction-tomxu'
}
export const supportStore = defineStore('supportStore', {
  // state: () => ({ locale: window.localStorage.getItem('locale') || 'vi' }),
  state: () => ({ isOpen: false, key: '' }),
  actions: {
    setKey(key) {
      this.key = key
    },
    setIsOpen(value) {
      this.isOpen = value
    }
  }
})

export function useLocaleStoreWithOut() {
  return supportStore(store)
}
