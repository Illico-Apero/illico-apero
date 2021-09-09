export default class AddressEntity {

    /**
     * 
     * @param {String} idAddress 
     * @param {String} street 
     * @param {String} streetNumber 
     * @param {String} postalCode 
     * @param {String} city 
     * @param {Number} longitude 
     * @param {Number} latitude 
     * @param {String} approx_meters_from_main_storage_center 
     */
    constructor(idAddress, street, streetNumber, postalCode, city, longitude, latitude, approx_meters_from_main_storage_center) {
        this.idAddress = idAddress;
        this.street = street;
        this.streetNumber = streetNumber;
        this.postalCode = postalCode;
        this.city = city;
        this.longitude = longitude;
        this.latitude = latitude;
        this.approx_meters_from_main_storage_center = approx_meters_from_main_storage_center;
    }
}