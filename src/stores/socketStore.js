import { defineStore } from 'pinia'
export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: {}
    }),
    actions: {
        setSocket(payload) {
            this.socket = payload
        }
    }
})
