import { TcpRequestType } from "../adapters/tcp/tcp.interfaces";

export interface ControllerOptions {
    controllerName: string;
}

export interface WebSocketRouteContainer {
    [key: string]: Function;
}


export interface WebSocketRouteOptions {
    protocol: 'ws',
    route: string;
}


export interface TcpRouteContainer {
    [key: string]: [TcpRequestType, Function];
}

export interface TcpRouteOptions {
    protocol: 'tcp';
    requestType: TcpRequestType
    route: string;
}

export type RouteOptions = WebSocketRouteOptions | TcpRouteOptions
