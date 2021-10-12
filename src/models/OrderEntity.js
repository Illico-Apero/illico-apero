import OrderProductsEntity from "./assignation/OrderProductsEntity";
import StatusEntity from "./StatusEntity";
import UserPersonalInformationsEntity from "./UserPersonalInformationsEntity";

export default class OrderEntity {

    /**
     * 
     * @param {Number} idOrder 
     * @param {Number} fkStatus 
     * @param {Number} fkUserPersonalInformation 
     * @param {Number} stripePaymentIntentId 
     * @param {Number} totalPrice 
     * @param {String} userRemark
     * @param {Array<OrderProductsEntity>} orderProductsByIdOrder 
     * @param {StatusEntity} statusByFkStatus
     * @param {Array<UserPersonalInformationsEntity>} userPersonalInformationsByFkUserPersonalInformations
     */
    constructor(idOrder, fkStatus, fkUserPersonalInformation, stripePaymentIntentId, totalPrice, userRemark,
                orderProductsByIdOrder, statusByFkStatus, userPersonalInformationsByFkUserPersonalInformations) {
        this.idOrder = idOrder;
        this.fkStatus = fkStatus;
        this.fkUserPersonalInformation = fkUserPersonalInformation;
        this.stripePaymentIntentId = stripePaymentIntentId;
        this.totalPrice = totalPrice;
        this.userRemark = userRemark;
        this.orderProductsByIdOrder = orderProductsByIdOrder;
        this.statusByFkStatus = statusByFkStatus;
        this.userPersonalInformationsByFkUserPersonalInformations = userPersonalInformationsByFkUserPersonalInformations;
    }
}