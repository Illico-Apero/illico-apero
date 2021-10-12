export default class FormulaEntity {

    /**
     * 
     * @param {Number} idFormula 
     * @param {String} name 
     * @param {String} description 
     * @param {Number} price 
     * @param {String} picturePath 
     */
    constructor(idFormula, name, description, price, picturePath) {
        this.idFormula = idFormula;
        this.name = name;
        this.description = description;
        this.price = price;
        this.picturePath = picturePath;
    }
}