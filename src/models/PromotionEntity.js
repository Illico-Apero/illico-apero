export default class PromotionEntity {

    /**
     * 
     * @param {Number} idPromotion 
     * @param {String} promotionCode 
     * @param {Number} reductionInPercents 
     * @param {Boolean} isValid 
     * @param {String} comment 
     */
    constructor(idPromotion, promotionCode, reductionInPercents, isValid, comment) {
        this.idPromotion = idPromotion;
        this.promotionCode = promotionCode;
        this.reductionInPercents = reductionInPercents;
        this.isValid = isValid;
        this.comment = comment;
    }
}