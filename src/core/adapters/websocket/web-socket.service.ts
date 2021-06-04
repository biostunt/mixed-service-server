import {Server as HttpServer} from 'http'
import { Server as SocketIOServer, Socket as ClientIOServer } from 'socket.io';

export function createWebSocketServer(httpServer: HttpServer) {
    return new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
}
