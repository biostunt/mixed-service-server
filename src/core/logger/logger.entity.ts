import { LoggerOptions } from "./logger.interfaces";
import { Logger } from '../common';
import fs from 'fs';

export class LoggerEntity implements Logger{
    constructor(private readonly _options: LoggerOptions) {
        this.log(`
            ---Logger---
        `)
    }
    
    private getFilePath(): string {
        return typeof this._options.filePath === "function" ? this._options.filePath() : this._options.filePath;
    }

    private writeToFile(message: string) : void {
        if (!fs.existsSync(this.getFilePath())) {
            fs.writeFileSync(this.getFilePath(), '');
        }
        fs.appendFile(this.getFilePath(), message, (err) => {
            if (err) console.log(err);
        })
    }

    public log (message: string) {
        let date = new Date().toLocaleString();
        this.writeToFile(`[${date}] ${message} \n`);
    }
}