export default class ProductDetailsEntity {

    /**
     * 
     * @param {Number} idProductDetails 
     * @param {String} volume 
     * @param {Number} degree 
     * @param {String} origin 
     */
    constructor(idProductDetails, volume, degree, origin) {
        this.idProductDetails = idProductDetails;
        this.volume = volume;
        this.degree = degree;
        this.origin = origin;
    }
}