import Http from '../Http';
import configuration from '../../config/configuration.json';

export default class StoreService {

	isStoreOpened(callback) {
		Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.isStoreOpened, (data) => {
			callback(data);
		});
	}

	getStore(callback) {
		Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getStore, (data) => {
			callback(data);
		});
	}
}