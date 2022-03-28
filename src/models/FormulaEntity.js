export default class FormulaEntity {

    /**
     * 
     * @param {Number} idFormula 
     * @param {String} name 
     * @param {String} description 
     * @param {Number} price 
     * @param {String} picturePath
     * @param {Boolean} available
     */
    constructor(idFormula, name, description, price, picturePath, available, createdAt, updatedAt) {
        this.idFormula = idFormula;
        this.name = name;
        this.description = description;
        this.price = price;
        this.picturePath = picturePath;
        this.available = available;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}