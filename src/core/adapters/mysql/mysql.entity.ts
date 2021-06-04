import mysql, {Connection, MysqlError, Query} from 'mysql';
import { Logger } from '../../common';
import { DatabaseAdapter } from "../adapter.interfaces";
import {MysqlOptions} from './mysql.interfaces'

export class MysqlConnector implements DatabaseAdapter {
    
    protected connection : Connection;

    constructor(private readonly _options: MysqlOptions, private _logger: Logger) {}


    public async connect(): Promise<void> {
        return new Promise((resolve): void => {
            
            this.connection = mysql.createConnection(Object.assign({}, this._options, {}));
            this.connection.connect((err) : void => {
                if (err) throw err;
                this._logger.log(`[MYSQL_ADAPTER] connected to DataBase ${this._options.database}`)
                resolve();
            });
        });
    }

    public async close(): Promise<void> {
        return new Promise((resolve, reject) : void => {
            this.connection.end((err: MysqlError | undefined) : void => {
                err ? reject(err) : resolve();
            });
        });
    }

    public async execute<T>(req: string, values : any = []) : Promise<T> {
        return new Promise((resolve, reject) => {
            this.connection.query(req, values, (err: MysqlError | null, data : T) : void => {
                if (err) {
                    this._logger.log(`[MYSQL_ADAPTER] error on request:'${req}' values:${values}`);
                    reject(err);
                } else resolve(data);
            });
        });
    }

}



const connector = new MysqlConnector({
    user: "root",
    password: "",
    host: "localhost",
    database: "profvektor"
}, console);

export default connector;