import Http from '../Http';
import configuration from '../../config/configuration.json';

export default class PromotionService {

	getIfValid(promotionCode, jwt, callback) {
		Http.get(configuration.server.baseUrl + configuration.endpoints.getIfValid + '/' + promotionCode, jwt, (data) => {
			callback(data);
		});
	}
}