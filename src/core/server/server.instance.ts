import { Logger } from "../common";

export interface ServerInstanceConstructor {
    new (_options: any, _logger: Logger): ServerInstance;
}

export interface ServerInstance {
    start: () => any;
}