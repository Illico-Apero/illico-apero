import ApiResponse from "../models/api/ApiResponse";
import UserEntity from "../models/UserEntity";
import UserService from "../network/services/UserService";

export default class Utils {

    static timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    static getCategoryPlural(category) {
        switch(category) {
            case 'Spiritueux':
                return 'Spiritueux';
            case 'Vin':
                return 'Vins';
            case 'Champagne':
                return 'Champagnes';
            case 'Bière':
                return 'Bières';
            case 'Biere':
                return 'Bières';
            case 'Soft':
                return 'Softs';
            default:
                return 'Spiritueux';
        }
    }

    static getEmojiAccordingToCategory(category) {
        switch(category) {
            case 'Spiritueux':
                return '🥃';
            case 'Vin':
                return '🍷';
            case 'Champagne':
                return '🍾';
            case 'Bière':
                return '🍺';
            case 'Biere':
                return '🍺';
            case 'Soft':
                return '🥤';
            default:
                return '🥃';
        }
    }

    static getCategoryPluralWith_LES_inFront(category) {
        return 'Les ' + Utils.getCategoryPlural(category);
    }

    static getCategoryPluralWith_LES_inFrontAndEmoji(category) {
        return Utils.getCategoryPluralWith_LES_inFront(category) + ' ' + Utils.getEmojiAccordingToCategory(category);
    }

    /**
     * 
     * @param {UserEntity} userEntity 
     * @param {Function<UserEntity>} callback 
     */
    static refreshJwt(userEntity, callback) {
        const userService = new UserService();
        userService.refreshToken(userEntity,  (data) => {
            /** @type {ApiResponse} data */
            let apiResponse = JSON.parse(data);
            if(apiResponse.status === ApiResponse.GET_SUCCESS()) {
                userEntity.jwt = apiResponse.response;
                localStorage.setItem('userEntity', JSON.stringify(userEntity))
                console.warn("JWT was refreshed");
                callback(userEntity);
            }
            else {
                callback(null);
            }
        });
    }

    static isTokenValid(jwt, callback) {
        const userService = new UserService();
        userService.testToken(jwt, (data) => {
            callback(data.status !== 401 && jwt !== null);
        })
    }

    /**
     * 
     * @param {UserEntity} userEntity the initial userEntity
     * @param {Function} callback : callback function that takes an UserEntity as param
     */
    static handleEventuallyExpiredJwt(userEntity, callback) {
        Utils.isTokenValid(userEntity.jwt, (tokenValid) => {
            if(!tokenValid) {
                Utils.refreshJwt(userEntity, (refreshedUserEntity) => {
                    if(refreshedUserEntity !== undefined && refreshedUserEntity !== null) {
                        callback(refreshedUserEntity);
                    } else {
                        callback(null);
                    }
                })
            } 
            // no need to refresh
            else {
                callback(userEntity);
            }
        })
    }
}