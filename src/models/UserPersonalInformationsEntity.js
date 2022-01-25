import AddressEntity from "./AddressEntity";

export default class UserPersonalInformationsEntity {

    /**
     * 
     * @param {Number} idUserPersonalInformations 
     * @param {String} firstname 
     * @param {String} surname 
     * @param {String} phone 
     * @param {AddressEntity} addressByFkAddress 
     */
    constructor(idUserPersonalInformations, firstname, surname, phone, addressByFkAddress) {
        this.idUserPersonalInformations = idUserPersonalInformations;
        this.firstname = firstname;
        this.surname = surname;
        this.phone = phone;
        this.addressByFkAddress = addressByFkAddress;
    }
}