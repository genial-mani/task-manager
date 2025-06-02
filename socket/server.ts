import { createServer } from 'http'
import { Server } from 'socket.io'

const PORT = 10000

const httpServer = createServer()


const io = new Server(httpServer, {
    cors: {
        origin: ["https://doit-ochre.vercel.app","http://localhost:10000"],
        methods: ["GET", "POST"],
        credentials: true,
    },
})

io.on("connection", (socket)=>{
    console.log('client connected', socket.id);

    socket.on("mark-task-done", (taskId)=>{
        console.log(`Task ${taskId} marked as done`);
        io.emit("task-done", taskId);
    })

    socket.on("disconnect",()=>{
        console.log("client disconnected:", socket.id)
    })
})

httpServer.listen(PORT,()=>{
    console.log(`Socket.io server is running on http://localhost:${PORT}`);
})