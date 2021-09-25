import AddressEntity from "../models/AddressEntity";

export default class FormValidator {

        
    /**
    * 
    * @param {Number} min 
    * @param {Number} max 
    * @param {String} str 
    * @returns {Boolean}
    */
    static isStringInBounds(min, max, str) {
       return (str.length >= min && str.length <= max);
    }

    /**
     * 
     * @param {String} email 
     * @returns {Boolean}
     */
    static isEmailValid(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * 
     * @param {String} password 
     * @returns 
     */
    static isPasswordInBounds(password) {
        return FormValidator.isStringInBounds(8, 32, password)
    }

    /**
     * 
     * @param {Array<String>} passwords 
     * @returns 
     */
    static doesPasswordMatch(passwords) {
        return passwords[0] === passwords[1]
    }

    static isFirstnameInBounds(firstname) {
        return FormValidator.isStringInBounds(1, 50, firstname)
    }

    static isSurnameInBounds(surname) {
        return FormValidator.isStringInBounds(1, 50, surname)
    }

    /**
     * 
     * @param {String} phone 
     */
    static isPhoneValid(phone) {
        return phone.startsWith("0") && phone.length === 10;
    }


    static validateAll(phoneNumber, firstname, surname, email, password) {
        return FormValidator.isPhoneValid(phoneNumber)
            && FormValidator.isEmailValid(email)
            && FormValidator.isStringInBounds(1, 50, firstname)
            && FormValidator.isStringInBounds(1, 50, surname)
            && FormValidator.isStringInBounds(1, 50, email)
            && FormValidator.isStringInBounds(8, 32, password);
    }

    /**
     * 
     * @param {AddressEntity} address 
     */
    static formatAddress(address) {
        return address.streetNumber + ' ' + address.street + ' ' + address.postalCode + ' ' + address.city
    }
}