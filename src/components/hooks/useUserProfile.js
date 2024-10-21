import { computed } from 'vue';
import {userStore} from "@/stores/userStore";
import {useRoute} from "vue-router";

export function useUserProfile() {
    const route = useRoute();
    const userInfo = computed(() => {
        return userStore().userInfo
    })
    const isMe = computed(() => {
        return userInfo.value.username === route.params.username
    });

    return {
        isMe,
    };
}