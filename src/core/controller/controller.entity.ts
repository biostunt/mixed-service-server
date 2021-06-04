import { WebSocketServerEvents } from '../server/websocket/websocket-server.interfaces';
import {TcpServerOptions} from '../server/tcp/tcp-server.interfaces'
import { TcpRequestType } from '../adapters/tcp/tcp.interfaces';
import { getWebSocketRouteContainer, getTcpRouteContainer } from './controller.service'
import { TcpRouteContainer, TcpRouteOptions, WebSocketRouteContainer } from './controller.interfaces';

export class ControllerEntity {

    public static controllers: Array<ControllerEntity> = new Array<ControllerEntity>();

    constructor() {
        ControllerEntity.controllers.push(this);
    }
    
    public hasRoute(protocol: 'ws' | 'tcp', route: string): boolean {
        return this.getHandlerByProtocol(protocol, route) === undefined;
    }

    public getRoutes(protocol: 'ws'): WebSocketRouteContainer;
    public getRoutes(protocol: 'tcp'): TcpRouteContainer;
    public getRoutes(protocol: 'ws' | 'tcp'): TcpRouteContainer |  WebSocketRouteContainer | undefined {
        return this.getHandlerContainerByProtocol(protocol);
    }

    public async execute(protocol: 'ws' | 'tcp', route: string, data: any, serverEvents: WebSocketServerEvents | TcpServerOptions): Promise<any> {
        let handler = this.getHandlerByProtocol(protocol, route)
        if (!handler) return;
        let result = typeof (handler) === "function" ? await handler(data, serverEvents) : await handler[1](data, serverEvents);
        return result;
    }

    private getHandlerByProtocol(protocol: 'ws' | 'tcp', route: string): Function | [TcpRequestType, Function] | undefined {
        return this.getHandlerContainerByProtocol(protocol)[route];
    }

    private getHandlerContainerByProtocol(protocol: 'ws' | 'tcp'): WebSocketRouteContainer | TcpRouteContainer | undefined {
        switch (protocol) {
            case 'ws':
                return getWebSocketRouteContainer(this);
            case 'tcp':
                return getTcpRouteContainer(this);
            default:
                return undefined;
        }
    }
}