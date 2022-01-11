import configuration from '../../config/configuration.json';
import Http from '../Http';

export default class ProductService {

	getCategories(callback) {
		Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getCategories, (data) => {
			callback(data);
		});
	}

	getProducts(callback) {
		Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getProducts, (data) => {
			callback(data);
		});
	}

	getProductsFromCategory(category, callback) {
		Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getProducts + '/' + category, (data) => {
			callback(data);
		});
	}
}