import OrderFormulasEntity from "./assignation/OrderFormulasEntity";
import OrderProductsEntity from "./assignation/OrderProductsEntity";
import StatusEntity from "./StatusEntity";
import UserPersonalInformationsEntity from "./UserPersonalInformationsEntity";

export default class OrderEntity {

    /**
     * 
     * @param {Number} idOrder 
     * @param {Number} fkStatus 
     * @param {Number} fkUserPersonalInformation 
     * @param {String} stripePaymentIntentId 
     * @param {String} paypalPaymentIntentId
     * @param {Number} totalPrice 
     * @param {String} userRemark
     * @param {Array<OrderProductsEntity>} orderProductsByIdOrder 
     * @param {Array<OrderFormulasEntity>} orderFormulasByIdOrder
     * @param {StatusEntity} statusByFkStatus
     * @param {UserPersonalInformationsEntity} userPersonalInformationsByFkUserPersonalInformations
     */
    constructor(idOrder, fkStatus, fkUserPersonalInformation, totalPrice, userRemark, createdAt,
                orderProductsByIdOrder, orderFormulasByIdOrder, statusByFkStatus, userPersonalInformationsByFkUserPersonalInformations) {
        this.idOrder = idOrder;
        this.fkStatus = fkStatus;
        this.fkUserPersonalInformation = fkUserPersonalInformation;
        this.totalPrice = totalPrice;
        this.userRemark = userRemark;
        this.createdAt = createdAt;
        this.orderProductsByIdOrder = orderProductsByIdOrder;
        this.orderFormulasByIdOrder = orderFormulasByIdOrder;
        this.statusByFkStatus = statusByFkStatus;
        this.userPersonalInformationsByFkUserPersonalInformations = userPersonalInformationsByFkUserPersonalInformations;
    }
}