import { defineStore } from 'pinia'
import {getChatBackgroundApi, getCountMessageApi} from "@/api/message";
export const useMessageStore = defineStore('message', {
    state: () => ({
        countData: {
            countNewAll: 0,
            countNewChat: 0,
            countNewGroup: 0
        },
        backgrounds: []
    }),
    actions: {
        setCountData(payload) {
            this.countData = payload
        },
        setBackgrounds(payload) {
            this.backgrounds = payload
        },
        async getBackgrounds() {
            const backgrounds = await getChatBackgroundApi()
            this.setBackgrounds(backgrounds)
        },
        refreshCount() {
            getCountMessageApi().then(resp => {
                this.setCountData(resp)
            })
        }
    }
})
