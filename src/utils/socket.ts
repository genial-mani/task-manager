import {io, Socket} from 'socket.io-client'

let socket: Socket | null = null;

export const initiateSocket = ()=>{
    if(!socket){
        socket = io("http://localhost:4000",{
            withCredentials: true,

        })
        console.log("Socket connected");
    }
}


export const getSocket = (): Socket =>{
    if(!socket){
        throw new Error("Socket not initialized. Call initiateSocket() first.");
    }

    return socket;
}