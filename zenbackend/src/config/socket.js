/**
 * Shared Socket.IO instance.
 *
 * This module exists to break the circular dependency:
 *   index.js → complaints.js / cron.js → index.js
 *
 * Usage:
 *   - index.js calls initSocket(httpServer) once at startup
 *   - Any other file imports { io } to emit events
 */
import { Server } from 'socket.io';

/** @type {import('socket.io').Server} */
let io = null;

/**
 * Create and configure the Socket.IO server.
 * Must be called exactly once from index.js.
 *
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);

        socket.on('join-admin', () => {
            socket.join('admin-room');
            console.log(`[Socket.IO] ${socket.id} joined admin-room`);
        });

        socket.on('join-dept', (dept) => {
            socket.join(`dept-${dept}`);
            console.log(`[Socket.IO] ${socket.id} joined dept-${dept}`);
        });

        socket.on('join-complaint', (id) => {
            socket.join(`complaint-${id}`);
            console.log(`[Socket.IO] ${socket.id} joined complaint-${id}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

/**
 * Get the current io instance.
 * Will be null until initSocket() is called.
 */
export function getIO() {
    return io;
}

export { io };
