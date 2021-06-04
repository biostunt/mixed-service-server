import { loadControllers } from './core/controller';
import { TcpServerEntity } from './core/server'
import path from 'path';

const server = new TcpServerEntity({ port: 3000 }, console);
const main = async () => {
    await loadControllers({controllersDirectory: path.resolve(__dirname, 'Controllers'), controllerPattern: '[.]controller[.]ts'});
    await server.start();
}

main();