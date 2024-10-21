import { defineStore } from 'pinia'
import { store } from './index.js'
export const useNotificationStore = defineStore('notification', {
    state: () => ({
        countData: {}
    }),
    actions: {
        setCountData(payload) {
            this.countData = payload
        }
    }
})

export function useNotificationStoreWithOut() {
    return useNotificationStore(store)
}
