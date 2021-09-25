import FormulaProductsEntity from "./assignation/FormulaProductsEntity";

export default class FormulaEntity {

    /**
     * 
     * @param {Number} idFormula 
     * @param {String} name 
     * @param {String} description 
     * @param {Number} price 
     * @param {String} picturePath 
     * @param {Array<FormulaProductsEntity>} formulaProductsByIdFormula 
     */
    constructor(idFormula, name, description, price, picturePath, formulaProductsByIdFormula) {
        this.idFormula = idFormula;
        this.name = name;
        this.description = description;
        this.price = price;
        this.picturePath = picturePath;
        this.formulaProductsByIdFormula = formulaProductsByIdFormula;
    }
}