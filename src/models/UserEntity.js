import CartEntity from "./CartEntity";
import UserPersonalInformationsEntity from "./UserPersonalInformationsEntity";

export default class UserEntity {

    /**
     * 
     * @param {Number} idUser 
     * @param {String} email 
     * @param {String} password 
     * @param {Number} fkCart 
     * @param {CartEntity} cartByFkCart 
     * @param {Number} fkUserPersonalInformation 
     * @param {UserPersonalInformationsEntity} userPersonalInformationsByFkUserPersonalInformation 
     */
    constructor(idUser, email, password, fkCart, cartByFkCart, fkUserPersonalInformation, userPersonalInformationsByFkUserPersonalInformation) {
        this.idUser = idUser;
        this.email = email;
        this.password = password;
        this.fkCart = fkCart;
        this.cartByFkCart = cartByFkCart;
        this.fkUserPersonalInformation = fkUserPersonalInformation;
        this.userPersonalInformationsByFkUserPersonalInformation = userPersonalInformationsByFkUserPersonalInformation;
        this.jwt = null;
    }
}