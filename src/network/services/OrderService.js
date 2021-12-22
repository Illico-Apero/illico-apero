import configuration from '../../config/configuration.json';
import PlaceOrderDto from '../../models/dto/PlaceOrderDto';
import Http from '../Http';

export default class OrderService {


    /**
     * 
     * @param {UserEntity} userEntity 
     * @param {String} userRemark
     * @param {Function} callback 
     */
     placeOrder(userEntity, paypalId, userRemark, callback) {
        const dto = new PlaceOrderDto(userRemark, paypalId);
        Http.postWithJwt(configuration.server.baseUrl + configuration.endpoints.placeOrder + '/' + userEntity.idUser + '/' + userEntity.databaseToken, JSON.stringify(dto), userEntity.jwt, (data) => {
            callback(data);
        });
    }

    getOrders(userEntity, callback) {
        Http.get(configuration.server.baseUrl + configuration.endpoints.getOrders + '/' + userEntity.idUser + '/' + userEntity.databaseToken, userEntity.jwt, (data) => {
            callback(data);
        });
    }
}