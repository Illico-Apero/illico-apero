import CartFormulasEntity from "./assignation/CartFormulasEntity";
import CartProductsEntity from "./assignation/CartProductsEntity";

export default class CartEntity {

    /**
     * 
     * @param {Number} idCart 
     * @param {String} updatedAt 
     * @param {Number} totalPrice 
     * @param {Array<CartProductsEntity>} cartProductsByIdCart 
     * @param {Array<CartFormulasEntity>} cartFormulasByIdCart
     */
    constructor(idCart, updatedAt, totalPrice, cartProductsByIdCart, cartFormulasByIdCart) {
        this.idCart = idCart;
        this.updatedAt = updatedAt;
        this.totalPrice = totalPrice;
        this.cartProductsByIdCart = cartProductsByIdCart;
        this.cartFormulasByIdCart = cartFormulasByIdCart;
    }
}