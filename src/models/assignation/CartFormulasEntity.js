import FormulaEntity from "../FormulaEntity";

export default class CartFormulasEntity {

    /**
     * 
     * @param {Number} idCartFormulas 
     * @param {Number} fkCart 
     * @param {Number} fkFormula 
     * @param {FormulaEntity} formulaByFkFormula 
     */
    constructor(idCartFormulas, fkCart, fkFormula, quantity, formulaByFkFormula) {
        this.idCartProducts = idCartFormulas;
        this.fkCart = fkCart;
        this.fkProduct = fkFormula;
        this.quantity = quantity;
        this.formulaByFkFormula = formulaByFkFormula;
    }
}