import configuration from '../../config/configuration.json';
import Http from '../Http';

export default class FormulaService {

    getFormulas(callback) {
        Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getFormulas, (data) => {
            callback(data);
        });
    }
}