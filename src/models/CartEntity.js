import CartProductsEntity from "./assignation/CartProductsEntity";

export default class CartEntity {

    /**
     * 
     * @param {Number} idCart 
     * @param {String} updatedAt 
     * @param {Number} totalPrice 
     * @param {CartProductsEntity[]} cartProductsByIdCart 
     */
    constructor(idCart, updatedAt, totalPrice, cartProductsByIdCart) {
        this.idCart = idCart;
        this.updatedAt = updatedAt;
        this.totalPrice = totalPrice;
        this.cartProductsByIdCart = cartProductsByIdCart;
    }
}