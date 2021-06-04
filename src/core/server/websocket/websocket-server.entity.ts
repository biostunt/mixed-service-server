import {Socket as WebSocketClient} from 'socket.io'
import { WebSocketEntity } from "../../adapters/websocket/web-socket.entity"
import { WebSocketServerOptions } from './websocket-server.interfaces';
import {Logger} from '../../common'
import { WebSocketServerEvents } from '../../adapters/websocket/web-socket.interfaces';
import { WebSocketRequest } from '../../common';
import { ControllerEntity } from '../../controller';
import { measureExecutionTime } from '../server.service';

export class WebSocketServerEntity {

    private connector!: WebSocketEntity;
    private connectorEvents!: WebSocketServerEvents;

    constructor(private readonly _options: WebSocketServerOptions, private _logger: Logger) { }
    
    protected async onMessageReceived(req: WebSocketRequest, client: WebSocketClient) {
        let controllers = ControllerEntity.controllers;
        for (let i = 0; i < controllers.length; i++) {
            let controller = controllers[i];
            if (!controller.hasRoute('ws', req.route)) continue;
            try {
                let result;
                let time = measureExecutionTime(async () => result = await controller.execute('ws', req.route, req.data, this.connectorEvents));
                this._logger.log(`[WEBSOCKET_REQUEST] Route:'${req.route}' Data:'${req.data? req.data : ''}' Time: ${time}ms.`);
                if(result) client.send({ id: req.id, data: result });
            } catch ({message}) {
                this._logger.log(message);
            } 
        }
    }

    protected onClientConnected(client: WebSocketClient) {
        this._logger.log(`Client connected with id=${client.id}`);
    }

    protected onClientDisconnected(client: WebSocketClient) {
        this._logger.log(`Client disconnected with id=${client.id}`);
    }

    public async start(): Promise<void> {
        this.connector = new WebSocketEntity(this._options, {
            onConnect: this.onClientConnected.bind(this),
            onDisconnect: this.onClientDisconnected.bind(this),
            onMessage: this.onMessageReceived.bind(this)
        }, this._logger);
        this.connectorEvents = await this.connector.start();
    }
}