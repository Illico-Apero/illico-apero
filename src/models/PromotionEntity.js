export default class PromotionEntity {

    /**
     * 
     * @param {Number} idPromotion 
     * @param {String} promotionCode 
     * @param {Date} createdAt
     * @param {Number} reductionInPercents 
     * @param {Boolean} isValid 
     * @param {String} comment 
     */
    constructor(idPromotion, createdAt, promotionCode, reductionInPercents, isValid, comment) {
        this.idPromotion = idPromotion;
        this.createdAt = createdAt
        this.promotionCode = promotionCode;
        this.reductionInPercents = reductionInPercents;
        this.isValid = isValid;
        this.comment = comment;
    }
}