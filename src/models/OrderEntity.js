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
     * @param {OrderProductsEntity[]} orderProductsByIdOrder 
     * @param {StatusEntity} statusByFkStatus
     * @param {UserPersonalInformationsEntity} userPersonalInformationsByFkUserPersonalInformations
     */
    constructor(idOrder, fkStatus, fkUserPersonalInformation, stripePaymentIntentId, totalPrice,
                orderProductsByIdOrder, statusByFkStatus, userPersonalInformationsByFkUserPersonalInformations) {
        this.idOrder = idOrder;
        this.fkStatus = fkStatus;
        this.fkUserPersonalInformation = fkUserPersonalInformation;
        this.stripePaymentIntentId = stripePaymentIntentId;
        this.totalPrice = totalPrice;
        this.orderProductsByIdOrder = orderProductsByIdOrder;
        this.statusByFkStatus = statusByFkStatus;
        this.userPersonalInformationsByFkUserPersonalInformations = userPersonalInformationsByFkUserPersonalInformations;
    }
}