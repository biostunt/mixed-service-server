import { TcpRequestType } from "../adapters/tcp/tcp.interfaces";
import { ControllerEntity } from "./controller.entity";
import {
    ControllerOptions,
    RouteOptions,
    WebSocketRouteOptions,
    TcpRouteOptions,
    WebSocketRouteContainer,
    TcpRouteContainer
} from './controller.interfaces'

import fs from 'fs';
import path from 'path';
import { Logger } from "../common";

const CONTROLLER_PROPERTIES = 'controller::options';
const WEBSOCKETROUTES = 'controller::ws-routes';
const TCPROUTES = 'controller::tcp-routes';

export function getWebSocketRouteContainer(target: any): WebSocketRouteContainer {
    return Reflect.getMetadata(WEBSOCKETROUTES, target);
}

export function getWebSocketRouteHandler(target: any, route: string): Function | undefined {
    return getWebSocketRouteContainer(target)[route];
}

function attachWebSocketHandler(target: any, callback: Function, options: WebSocketRouteOptions) {
    let container: WebSocketRouteContainer = getWebSocketRouteContainer(target) || {};
    container[options.route] = callback.bind(target);
    Reflect.defineMetadata(WEBSOCKETROUTES, container, target);
}


export function getTcpRouteContainer(target: any): TcpRouteContainer {
    return Reflect.getMetadata(TCPROUTES, target);
}

export function getTcpRouteHandler(target: any, route: string): [TcpRequestType, Function] | undefined {
    return getTcpRouteContainer(target)[route];
}

function attachTcpHandler(target: any, callback: Function, options: TcpRouteOptions) {
    let container: TcpRouteContainer = getTcpRouteContainer(target) || {};

    container[options.route] = [options.requestType, callback.bind(target)];
    Reflect.defineMetadata(TCPROUTES, container, target);
}

export function Controller<T extends ControllerEntity = ControllerEntity>(options?: ControllerOptions) {
    return function (target: any) {
        Reflect.defineMetadata(CONTROLLER_PROPERTIES, options || {controlerName: target.name}, target.prototype)
    } 
}

export function Route(options: RouteOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options.protocol === 'ws') {
            attachWebSocketHandler(target, descriptor.value, options);
        }
        if (options.protocol === 'tcp') {
            attachTcpHandler(target, descriptor.value, options);
        }
    };
}



async function getDirFiles(path: string) : Promise<string[]> {
    return new Promise((res, rej) => {
        fs.readdir(path, (err, files: string[]) => {
            if (err) rej(err);
            else res(files);
        });
    })
}

export interface ControllerLoaderProps {
    controllersDirectory: string;
    controllerPattern: string;
}

export async function loadControllers(props: ControllerLoaderProps, logger: Logger = console) {
    const { controllersDirectory, controllerPattern } = props;
    const dirs = (await getDirFiles(controllersDirectory)).filter((filename) => filename.match('[A-Z]{1}'));
    const controllers = new Array<string>();
    for (let i = 0; i < dirs.length; i++) {
        const files = await getDirFiles(path.resolve(controllersDirectory, dirs[i]));
        if (files.filter(filename => filename.match(controllerPattern)).length) {
            files.forEach((filename) => controllers.push(`${controllersDirectory}/${dirs[i]}/${filename}`));
        }
    }
    controllers.forEach((filename) => {
        try {
            const ControllerClass = require(filename).default;
            const opts: ControllerOptions = Reflect.getMetadata(CONTROLLER_PROPERTIES, new ControllerClass());
            logger.log(`[CONTROLLER_LOADER] ${opts.controllerName} loaded.`)
        } catch ({ message }) {
            logger.log(message);
        }
    });
}