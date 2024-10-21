import {io} from "socket.io-client";
import {SOCKET_URL} from "@/helper/const";
import {getToken} from "@/helper/http/cookie";
import {removeHtmlTags} from "@/helper/ultil";
import {useNotificationStore} from "@/stores/notificationStore";
import {computed, inject} from "vue";
import {ACCOUNT_TYPES, REACTIVE_TYPES, TOMXU_TYPES} from "@/helper/const-notify";
import {useSocketStore} from "@/stores/socketStore";
import {useMessageStore} from "@/stores/messageStore";

export function useSocket() {
    const socketStore = useSocketStore()
    const messageStore = useMessageStore();
    const emitter = inject('emitter')
    const socket = io(SOCKET_URL,{
        transports: ['websocket', 'polling'],
        query: {
            authorization: `Bearer ${getToken()}`
        },
    });
    socket.on("connect", () => {
        socket.on('notification', (data) =>  {
            if (data.addCount) {
                handleAddNotification(data)
            }
            if (data.type === 'add_group_chat') {
                messageStore.refreshCount()
            }
            emitter.emit('ON_NOTIFY')
        })
        socket.emit('firebase', {
            type: 'join'
        })
    });
    socket.on('newMessage', (data) => {
        handleCountMessage(data)
    })
    socketStore.setSocket(socket);

    const notificationStore = useNotificationStore()
    const countData = computed(() => notificationStore.countData)


    const increaseCount = (type, count = 1) => {
        const currentCount = countData.value[type] || 0
        notificationStore.setCountData({
            ...countData.value,
            [type]: currentCount + count
        });
    };

    const handleAddNotification = (data) => {
        increaseCount("countAll")
        if (REACTIVE_TYPES.includes(data.type)) {
            increaseCount("countInteract")
        }
        if (ACCOUNT_TYPES.includes(data.type)) {
            increaseCount("countAccount")
        }
        if (TOMXU_TYPES.includes(data.type)) {
            increaseCount("countTomXu")
        }
    }

    const countMessageData = computed(() => messageStore.countData)
    const increaseCountMessage = (type, count = 1) => {
        const currentCount = countMessageData.value[type] || 0;
        const currentCountAll = countMessageData.value.countNewAll || 0;
        messageStore.setCountData({
            ...countMessageData.value,
            countNewAll: currentCountAll + count,
            [type]: currentCount + count
        });
    };
    const handleCountMessage = (data) => {
        if (data.type && data.type === 'group') {
            increaseCountMessage("countNewGroup")
        } else {
            increaseCountMessage("countNewChat")
        }
    }
    return {
        socket
    }
}
