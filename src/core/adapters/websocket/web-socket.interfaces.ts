import {Socket as WebSocketClient} from 'socket.io'

export interface WebSocketOptions {
    port: number;
    maxListeners: number;
}

export interface WebSocketClientEvents {
    onConnect?: (client: WebSocketClient) => void;
    onDisconnect?: (client: WebSocketClient) => void;
    onMessage?: (data: any, client: WebSocketClient) => void;
}

export interface WebSocketServerEvents {
    sendToAll: (data: any) => void;
}