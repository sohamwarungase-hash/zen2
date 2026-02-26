import { Server } from 'socket.io';

let io = null;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? process.env.CLIENT_URL
                : true,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        socket.on('join-admin', () => {
            socket.join('admin-room');
        });

        socket.on('join-complaint', (id) => {
            socket.join(`complaint-${id}`);
        });

        socket.on('join-dept', (dept) => {
            socket.join(`dept-${dept}`);
        });
    });

    return io;
}

export function getIO() {
    return io;
}

export { io };
