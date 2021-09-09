import ProductEntity from "../ProductEntity";

export default class FormulaProductsEntity {

    /**
     * 
     * @param {Number} idFormulaProduct 
     * @param {Number} fkFormula 
     * @param {Number} fkProduct 
     * @param {ProductEntity} productByFkProduct 
     */
    constructor(idFormulaProduct, fkFormula, fkProduct, productByFkProduct) {
        this.idFormulaProduct = idFormulaProduct;
        this.fkFormula = fkFormula;
        this.fkProduct = fkProduct;
        this.productByFkProduct = productByFkProduct;
    }
}