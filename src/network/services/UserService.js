import ApiResponse from "../../models/api/ApiResponse";
import UserEntity from "../../models/UserEntity";
import Http from "../Http";
import configuration from '../../config/configuration.json';

export default class UserService {

	/**
	 * 
	 * @param {UserEntity} userEntity 
	 */
	signUp(userEntity, callback) {
		Http.postWithoutJwt(configuration.server.baseUrl + configuration.endpoints.signUp, JSON.stringify(userEntity),
			(data) => {
				callback(data);
			});
	}

	/**
	 * @param {UserEntity} userEntity
	 */
	signIn(userEntity, callback) {
		Http.postWithoutJwt(configuration.server.baseUrl + configuration.endpoints.signIn, JSON.stringify(userEntity),
			(data) => {
				callback(data);
			});
	}

	testToken(jwt, callback) {
		Http.get(configuration.server.baseUrl + configuration.endpoints.testToken, jwt, (data) => {
			callback(data);
		})
	}

	refreshToken(userEntity, callback) {
		Http.postWithoutJwt(configuration.server.baseUrl + configuration.endpoints.refreshToken, JSON.stringify(userEntity), (data) => {
			callback(data);
		})
	}
}