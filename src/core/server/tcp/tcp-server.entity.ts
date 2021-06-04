import { TcpEntity } from '../../adapters/tcp/tcp.entity';
import { Logger } from '../../common';
import { ControllerEntity } from '../../controller';
import { TcpRouteContainer } from '../../controller/controller.interfaces';
import {ServerInstance} from '../server.instance'
import { measureExecutionTime } from '../server.service';
import { TcpServerOptions } from './tcp-server.interfaces';

export class TcpServerEntity implements ServerInstance {

    private connector!: TcpEntity;

    constructor(private readonly _options: TcpServerOptions, private _logger: Logger){}
    
    public attachHandlers(): void {
        for (let i = 0; i < ControllerEntity.controllers.length; i++) {
            const controller = ControllerEntity.controllers[i];
            const routes: TcpRouteContainer = controller.getRoutes('tcp');
            for (const [route, handler] of Object.entries(routes)) {
                this._logger.log(`[TCP_SERVER] route attached. Route:'${route}' Method:'${handler[0]}', Function:'${handler[1].name.split(' ')[1]}'`);
                this.connector.registerRoute(handler[0], route, async (req, res) => {
                    let result;
                    let time = await measureExecutionTime(async () => result = await handler[1](req.body, null));
                    this._logger.log(`[TCP_REQUEST] Route:'${route}' Method:'${handler[0]}' Data:'${req.body? req.body : ''}' Time: ${time}ms.`);
                    typeof (result) === 'function' ? result(res) : res.send(result);
                });
            }
        }
    }
    
    public async start(): Promise<any> {
        this.connector = new TcpEntity(this._options, this._logger);
        await this.connector.start()
        this.attachHandlers();
    }

}

