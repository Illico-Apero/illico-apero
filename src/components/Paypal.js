import React from 'react';
import { useRef, useEffect } from 'react';
import CartEntity from '../models/CartEntity';
import UserEntity from '../models/UserEntity';
import FrontEndLogService from '../network/services/FrontEndLogService';
import Checkout from '../screens/Checkout';


/**
 * @param {CartEntity} cartEntity : cartEntity
 * @param {UserEntity} userEntity : userEntity
 * @param {Function} paymentPlacedCallback
 * @returns 
 */
export default function Paypal(props) {
    const paypal = useRef();


    useEffect(() => {
        const frontEndLogService = new FrontEndLogService();
        try {
            const initializeItem = (item, isFormula) => {
                return {
                    name: isFormula ? item.formulaByFkFormula.name : item.productByFkProduct.name,
                    unit_amount: {
                        currency_code: 'EUR',
                        value: isFormula ? parseFloat(item.formulaByFkFormula.price.toFixed(2)) : parseFloat(item.productByFkProduct.price.toFixed(2))
                    },
                    quantity: item.quantity,
                    category:'PHYSICAL_GOODS'
                }
            }
            const initializePurchaseUnit = /** @param {CartEntity} cartEntity */ (cartEntity) => {
                let items = [];
                for(const formula of cartEntity.cartFormulasByIdCart)  {
                    items.push(initializeItem(formula, true));
                }
                for(const product of cartEntity.cartProductsByIdCart) {
                    items.push(initializeItem(product, false))
                }
        
                let hasDiscount = false;
                let discount = 0;
                let value = 0;
                if(cartEntity.promotionByFkPromotion !== null && cartEntity.totalPriceWithPromotion !== null) {
                    hasDiscount = true;
                    discount = cartEntity.totalPrice - cartEntity.totalPriceWithPromotion
                    value = cartEntity.totalPrice + Checkout.GET_DELIVERY_PRICE() - discount;
                }
                else {
                    value = cartEntity.totalPrice + Checkout.GET_DELIVERY_PRICE()
                }
                let purchaseUnit = {
                    amount: {
                        currency_code: 'EUR',
                        value: parseFloat(value.toFixed(2)),
                        breakdown: {
                            item_total: {
                                currency_code: 'EUR',
                                value: parseFloat(cartEntity.totalPrice.toFixed(2))
                            },
                            shipping: {
                                currency_code: 'EUR',
                                value: Checkout.GET_DELIVERY_PRICE()
                            },
                            discount: {
                                value:parseFloat(discount.toFixed(2)),
                                currency_code:'EUR'
                            }
                        }
                    },
                    items: items
                };
                if(!hasDiscount) delete  purchaseUnit.amount.breakdown.discount;
                return purchaseUnit;
            }
            const handleError = (err) => {
                console.error(err);
                frontEndLogService.saveLog(this.props.userEntity ? this.props.userEntity.idUser : 0, err);
                alert('Une erreur est survenue pendant le paiement. Vous n\'avez pas été débité.\nS\'il vous plaît, veuillez contacter un administrateur ou réessayer plus tard.');
            }
            window.paypal_sdk.Buttons({
                //NOTE / INFO :
                // props is not in the dependency array so if address changes, it won't be changed from the paypal POV. + Adding props to the dependency would cause
                // the buttons to be rerendered, without the previous buttons being deleted. So for now, I just removed the props from the dependency array and I don't care
                // about having the wrong address in the paypal stuff.
    
                //EDIT : Now the logic is that when the buttons are rendered (on the checkout page) nothing changes (no address/amount change) so it should be ok.
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        payer: {
                            email_address: props.userEntity.email,
                            name: {
                                given_name: props.userEntity.userPersonalInformationsByFkUserPersonalInformation.firstname,
                                surname: props.userEntity.userPersonalInformationsByFkUserPersonalInformation.surname,
                            },
                            address: {
                                address_line_1: props.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.streetNumber + ' ' + props.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.street + ' ' + props.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.city,
                                postal_code: props.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.postalCode,
                                admin_area_2: props.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.city,
                                country_code: 'FR'
                            },
                            phone: {
                                phone_type: 'MOBILE',
                                phone_number: {
                                    national_number: props.userEntity.userPersonalInformationsByFkUserPersonalInformation.phone
                                }
                            }
                        },
                        purchase_units: [
                            initializePurchaseUnit(props.cartEntity)
                        ],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        },
                        email_address: "customer@domain.com"
                    })
                },
                onApprove: async(data, actions) => {
                    try{
                        const order = await actions.order.capture();
                        props.paymentPlacedCallback(order);
                    } catch(err) {
                        handleError(err);
                    }
    
                },
                onError: (err) => {
                    handleError(err);
                }
            }).render(paypal.current);
        } catch(error) {
            frontEndLogService.saveLog(this.props.userEntity ? this.props.userEntity.idUser : 0, error);
            console.error(error);
            alert('Impossible d\'initialiser les éléments Paypal pour le paiement.\nS\'il vous plaît, veuillez contacter un administrateur ou réessayer plus tard.');
        }
        
        //eslint-disable-next-line
    }, [])

    return (
        <div>
            <div ref={paypal}/>
        </div>
    )
}