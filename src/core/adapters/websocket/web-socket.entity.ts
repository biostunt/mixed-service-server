import {Server as WebSocketServer, Socket as WebSocketClient } from 'socket.io';
import { Logger } from '../../common';
import {WebSocketOptions, WebSocketClientEvents, WebSocketServerEvents} from './web-socket.interfaces'
import { createWebSocketServer } from './web-socket.service';
import { createHttpServer } from '../adapter.service';
import {TransportAdapter} from '../adapter.interfaces'

export class WebSocketEntity implements TransportAdapter {

    private server: WebSocketServer;
    
    constructor(private readonly _options: WebSocketOptions, private readonly _clientEvents: WebSocketClientEvents, private _logger: Logger) { }

    public sendToAll(data: any): void {
        this.server.sockets.emit('message', data);
    }

    public async start(): Promise<WebSocketServerEvents> {
        const http = await createHttpServer(this._options.port);
        this.server = createWebSocketServer(http);
        this.server.setMaxListeners(this._options.maxListeners);
        this.server.on('connection', (client: WebSocketClient) => {
            this._clientEvents.onConnect?.(client);
            client.on('message', (data: any) => this._clientEvents.onMessage?.(data, client));
            client.on('disconnect', () => this._clientEvents.onDisconnect?.(client));   
        })
        this._logger.log('[WEBSOCKET_TRANSPORT] started');
        return { sendToAll: this.sendToAll.bind(this) }
    }
}
