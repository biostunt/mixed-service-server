import {Server as HttpServer} from 'http'

export function createHttpServer(port: number): Promise<HttpServer> {
    return new Promise((resolve, reject) => {
        let httpServer = new HttpServer();
        httpServer.listen(port, () => resolve(httpServer));
    })
}