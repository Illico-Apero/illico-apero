import ProductEntity from "../ProductEntity";

export default class CartProductsEntity {

    /**
     * 
     * @param {Number} idCartProducts 
     * @param {Number} fkCart 
     * @param {Number} fkProduct 
     * @param {ProductEntity} productByFkProduct 
     */
    constructor(idCartProducts, fkCart, fkProduct, quantity, productByFkProduct) {
        this.idCartProducts = idCartProducts;
        this.fkCart = fkCart;
        this.fkProduct = fkProduct;
        this.quantity = quantity;
        this.productByFkProduct = productByFkProduct;
    }
}