import { ControllerEntity, Controller, Route } from '../../Core/controller';
import mysqlConnector from '../../Core/adapters/mysql/mysql.entity'


@Controller({controllerName: 'test-controller'})
class TestController extends ControllerEntity {

    @Route({protocol: 'ws', route: '/getSomeData'})
    async getSomeData(data: {count: number}): Promise<Array<string>> {
        return new Array(data.count).fill('hello world!');
    }

    @Route({ protocol: 'tcp', requestType: 'get', route: '/test/orm' })
    async testOrmRequest(): Promise<any> {
        return 1
    }
}

export default TestController;