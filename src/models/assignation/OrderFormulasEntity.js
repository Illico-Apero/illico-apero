import FormulaEntity from "../FormulaEntity";

export default class OrderFormulasEntity {
    
    /**
     * 
     * @param {Number} idOrderFormulas 
     * @param {Number} fkOrder 
     * @param {Number} fkFormula 
     * @param {Number} quantity 
     * @param {FormulaEntity} formulaByFkFormula 
     */
    constructor(idOrderFormulas, fkOrder, fkFormula, quantity, formulaByFkFormula) {
        this.idOrderFormulas = idOrderFormulas;
        this.fkOrder = fkOrder;
        this.fkFormula = fkFormula;
        this.quantity = quantity;
        this.formulaByFkFormula = formulaByFkFormula;
    }
}