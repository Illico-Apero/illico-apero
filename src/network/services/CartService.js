import configuration from '../../config/configuration.json';
import CartEntity from '../../models/CartEntity';
import FormulaEntity from '../../models/FormulaEntity';
import ProductEntity from '../../models/ProductEntity';
import UserEntity from '../../models/UserEntity';
import Http from '../Http';

export default class CartService {

    /**
     * 
     * @param {ProductEntity} productEntity 
     * @param {String} jwt
     * @param {Function} callback
     */
    addProductToCart(productEntity, jwt, callback) {
        Http.postWithJwt(configuration.server.baseUrl + configuration.endpoints.addProductToCart, JSON.stringify(productEntity), jwt, (data) => {
            callback(data);
        });
    }

    /**
     * 
     * @param {FormulaEntity} formulaEntity 
     * @param {String} jwt 
     * @param {Function} callback 
     */
    addFormulaToCart(formulaEntity, jwt, callback) {
        Http.postWithJwt(configuration.server.baseUrl + configuration.endpoints.addFormulaToCart, JSON.stringify(formulaEntity), jwt, (data) => {
            callback(data);
        });
    }

    /**
     * 
     * @param {UserEntity} userEntity 
     * @param {String}} jwt 
     * @param {Function} callback 
     */
    getAmountIncart(userEntity, jwt, callback) {
        Http.get(configuration.server.baseUrl + configuration.endpoints.getAmountInCart + '/' + userEntity.idUser + '/' + userEntity.databaseToken, jwt, (data) => {
            callback(data);
        });
    }

    getCart(userEntity, jwt, callback) {
        Http.get(configuration.server.baseUrl + configuration.endpoints.getCart + '/' + userEntity.idUser + '/' + userEntity.databaseToken, jwt, (data) => {
            callback(data);
        });
    }

    /**
     * 
     * @param {UserEntity} userEntity 
     * @param {CartEntity} cartEntity 
     * @param {String} jwt 
     * @param {Function} callback 
     */
    saveCart(userEntity, cartEntity, jwt, callback) {
        Http.postWithJwt(configuration.server.baseUrl + configuration.endpoints.saveCart + '/' + userEntity.idUser + '/' + userEntity.databaseToken, JSON.stringify(cartEntity), jwt, (data) => {
            callback(data);
        });
    }

    clearCart(userEntity, cartEntity, jwt, callback) {
        Http.postWithJwt(configuration.server.baseUrl + configuration.endpoints.clearCart + '/' + userEntity.idUser + '/' + userEntity.databaseToken, JSON.stringify(cartEntity), jwt, (data) => {
            callback(data);
        });
    }
}