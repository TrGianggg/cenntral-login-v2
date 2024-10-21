import {io} from "socket.io-client";
import {SOCKET_URL} from "@/helper/const";
import {getToken} from "@/helper/http/cookie";

export function useMessageSocket() {
    const socket = io(SOCKET_URL,{
        transports: ['websocket', 'polling'],
        query: {
            authorization: `Bearer ${getToken()}`
        },
    });
    socket.on("connect", () => {
        socket.on('message', (data) => {
            console.log('data 11', data);
        })
        // socket.on('newMessage', (data) => {
        //     console.log('newMessage 123', data);
        // })
        // socket.on('newMessage', (data) => {
        //     console.log('hhhh', data);
        // })
    });

    return {
        socket
    };
}