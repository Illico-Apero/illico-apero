import ProductEntity from "../ProductEntity";

export default class FormulaProductsEntity {

    /**
     * 
     * @param {Number} idFormulaProduct 
     * @param {Number} fkFormula 
     * @param {Number} fkProduct 
     * @param {Number} quantity
     * @param {ProductEntity} productByFkProduct 
     */
    constructor(idFormulaProduct, fkFormula, fkProduct, quantity, productByFkProduct) {
        this.idFormulaProduct = idFormulaProduct;
        this.fkFormula = fkFormula;
        this.fkProduct = fkProduct;
        this.quantity = quantity;
        this.productByFkProduct = productByFkProduct;
    }
}