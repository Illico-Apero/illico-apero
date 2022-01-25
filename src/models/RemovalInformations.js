import CartEntity from "./CartEntity";

export default class RemovalInformations {


    /**
     * 
     * @param {CartEntity} cart : the cart to which belongs the item at itemIndex
     * @param {Number} itemIndex : the position of the item in the one of the cart arrays (CartFormulas, CartProducts)
     * @param {Boolean} isItemCartFormula : is the item a CartFormulasEntity or a CartProductsEntity
     */
    constructor(cart, itemIndex, isItemCartFormula) {
        this.cart = cart;
        this.itemIndex = itemIndex;
        this.isItemCartFormula = isItemCartFormula;
    }
}