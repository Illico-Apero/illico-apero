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
    constructor(idOrderProducts, fkOrder, fkProducts, quantity, productByFkProduct) {
        this.idOrderProducts = idOrderProducts;
        this.fkOrder = fkOrder;
        this.fkProducts = fkProducts;
        this.quantity = quantity;
        this.productByFkProduct = productByFkProduct;
    }
}