import CartEntity from "./CartEntity";

export default class GuestEntity {

    /**
     * 
     * @param {Number} idGuest 
     * @param {String} localCookieId 
     * @param {String} ip 
     * @param {String} createdAt 
     * @param {String} updatedAt 
     * @param {Number} fkCart 
     * @param {CartEntity} cartByFkCart 
     */
    constructor(idGuest, localCookieId, ip, createdAt, updatedAt, fkCart, cartByFkCart) {
        this.idGuest = idGuest;
        this.localCookieId = localCookieId;
        this.ip = ip;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.fkCart = fkCart;
        this.cartByFkCart = cartByFkCart;
    }
}