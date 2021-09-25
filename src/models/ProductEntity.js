export default class ProductEntity {

    /**
     * 
     * @param {Number} idProduct 
     * @param {String} name 
     * @param {String} description 
     * @param {Number} price
     * @param {String} volume
     * @param {String} category
     * @param {String} type
     * @param {String} origin
     * @param {Number} stock 
     * @param {String} picture_path 
     */
    constructor(idProduct, name, description, price, volume, category, type, origin, stock, picture_path) {
            this.idProduct = idProduct;
            this.name = name;
            this.description = description;
            this.price = price;
            this.volume = volume;
            this.category = category;
            this.type = type;
            this.origin = origin;
            this.stock = stock;
            this.picture_path = picture_path;
        }
}