import express, {Express} from 'express'

export function createExpressServer(port: number): Promise<Express> {
    return new Promise((resolve, reject) => {
        const app = express();
        app.listen(port, () => {
            resolve(app);
        })
    })
}