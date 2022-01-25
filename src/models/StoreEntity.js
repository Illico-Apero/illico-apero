import AddressEntity from "./AddressEntity";

export default class StoreEntity {

    /**
     * 
     * @param {Number} idStore 
     * @param {Number} fkAddress 
     * @param {*} openHour 
     * @param {*} closeHour 
     * @param {*} openDays 
     * @param {AddressEntity} addressByFkAddress 
     */
    constructor(idStore, fkAddress, openHour, closeHour, openDays, addressByFkAddress) {
        this.idStore = idStore;
        this.fkAddress = fkAddress;
        this.openHour = openHour;
        this.closeHour = closeHour;
        this.openDays = openDays;
        this.addressByFkAddress = addressByFkAddress;
    }
}