import CartFormulasEntity from "./assignation/CartFormulasEntity";
import CartProductsEntity from "./assignation/CartProductsEntity";
import PromotionEntity from "./PromotionEntity";

export default class CartEntity {

    /**
     * 
     * @param {Number} idCart 
     * @param {String} updatedAt 
     * @param {Number} totalPrice 
     * @param {Array<CartProductsEntity>} cartProductsByIdCart 
     * @param {Array<CartFormulasEntity>} cartFormulasByIdCart
     * @param {PromotionEntity} promotionByFkPromotion
     * @param {Number} totalPriceWithPromotion
     */
    constructor(idCart, updatedAt, totalPrice, cartProductsByIdCart, cartFormulasByIdCart, promotionByFkPromotion, totalPriceWithPromotion) {
        this.idCart = idCart;
        this.updatedAt = updatedAt;
        this.totalPrice = totalPrice;
        this.cartProductsByIdCart = cartProductsByIdCart;
        this.cartFormulasByIdCart = cartFormulasByIdCart;
        this.promotionByFkPromotion = promotionByFkPromotion;
        this.totalPriceWithPromotion = totalPriceWithPromotion;
    }
}