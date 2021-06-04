import { TransportAdapter } from "../adapter.interfaces";
import {createExpressServer} from './tcp.service'
import { Express, Request, Response } from 'express';
import {TcpOptions, TcpRequestType} from './tcp.interfaces'
import { Logger } from "../../common";

export class TcpEntity implements TransportAdapter{
    
    private server: Express;
    
    constructor(private readonly _options: TcpOptions, private _logger: Logger){}

    public async start(): Promise<void> {
        this.server = await createExpressServer(this._options.port);
        this._logger.log('[TCP_TRANSPORT] started');
    }

    public registerRoute(type: TcpRequestType, route: string, handler: (req: Request, res: Response) => any): void {
        this.server[type](route, handler);
    }

}