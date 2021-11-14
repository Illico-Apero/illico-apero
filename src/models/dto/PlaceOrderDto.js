export default class PlaceOrderDto {

    /**
     * 
     * @param {String} userRemark 
     * @param {String} paypalId
     */
    constructor(userRemark, paypalId) {
        this.userRemark = userRemark;
        this.paypalId = paypalId;
    }
}