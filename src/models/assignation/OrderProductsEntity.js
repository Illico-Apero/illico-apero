import ProductEntity from "../ProductEntity";

export default class OrderProductsEntity {
    
    /**
     * 
     * @param {Number} idOrderProducts 
     * @param {Number} fkOrder 
     * @param {Number} fkProducts 
     * @param {Number} quantity 
     * @param {ProductEntity} productByFkProduct 
     */
    constructor(idOrderProducts, fkOrder, fkProduct, quantity, productByFkProduct) {
        this.idOrderProducts = idOrderProducts;
        this.fkOrder = fkOrder;
        this.fkProduct = fkProduct;
        this.quantity = quantity;
        this.productByFkProduct = productByFkProduct;
    }
}