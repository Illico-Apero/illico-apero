import configuration from '../../config/configuration.json';
import Http from '../Http';
import Radius from '../../models/Radius'

export default class AddressService {

    getDeliveryRadius(callback) {
        Http.getWithoutJwt(configuration.server.baseUrl + configuration.endpoints.getDeliveryRadius, (data) => {
            let radiusInMeters = data.radius * 1000;
            let radius = new Radius(radiusInMeters);
            callback(radius);
        });
    }
}