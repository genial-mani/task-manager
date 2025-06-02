import {io, Socket} from 'socket.io-client'

let socket: Socket | null = null;

export const initiateSocket = ()=>{
    if(!socket){
        const URL =
      process.env.NODE_ENV === "production"
        ? "https://task-manager-production-6d59.up.railway.app"
        : "http://localhost:4000";
        socket = io(URL,{
            transports: ['websocket'],
            withCredentials: true,

        })
        console.log("Socket connected to:", URL);
    }
}


export const getSocket = (): Socket =>{
    if(!socket){
        throw new Error("Socket not initialized. Call initiateSocket() first.");
    }

    return socket;
}