import configuration from '../../config/configuration.json';
import Http from '../Http';

export default class VisitorService {

	logVisit(componentName, callback) {
		Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.logVisit + '/' + componentName, (data) => {
			callback(data);
		});
	}
}