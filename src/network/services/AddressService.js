import configuration from '../../config/configuration.json';
import Http from '../Http';
import Radius from '../../models/Radius'
import UserEntity from '../../models/UserEntity';
import AddressEntity from '../../models/AddressEntity';

export default class AddressService {

    getDeliveryRadius(callback) {
        Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getDeliveryRadius, (data) => {
            let radiusInMeters = data.radius * 1000;
            let radius = new Radius(radiusInMeters);
            callback(radius);
        });
    }

    /**
     * 
     * @param {UserEntity} userEntity 
     * @param {AddressEntity} addressEntity 
     * @param {String} jwt 
     * @param {Function} callback 
     */
    changeAddress(userEntity, addressEntity, callback) {
        Http.postWithJwt(configuration.server.baseUrl + configuration.endpoints.changeAddress + "/" + userEntity.idUser + "/" + userEntity.databaseToken, JSON.stringify(addressEntity), userEntity.jwt, (data) => {
            callback(data);
        });
    }
}