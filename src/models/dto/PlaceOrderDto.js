import PromotionEntity from "../PromotionEntity";

export default class PlaceOrderDto {

    /**
     * 
     * @param {String} userRemark 
     * @param {String} paypalId
     * @param {PromotionEntity} promotionEntity;
     */
    constructor(userRemark, paypalId, promotionEntity) {
        this.userRemark = userRemark;
        this.paypalId = paypalId;
        this.promotionEntity = promotionEntity;
    }
}