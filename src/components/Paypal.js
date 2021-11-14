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
        const initializeItem = (item, isFormula) => {
            return {
                name: isFormula ? item.formulaByFkFormula.name : item.productByFkProduct.name,
                unit_amount: {
                    currency_code: 'EUR',
                    value: isFormula ? item.formulaByFkFormula.price : item.productByFkProduct.price
                },
                quantity: item.quantity,
                description: isFormula ? item.formulaByFkFormula.description : item.productByFkProduct.description,
                category:'PHYSICAL_GOODS'
            }
        }
        const initializePurchaseUnit = /** @param {CartEntity} cartEntity */ (cartEntity) => {
            let items = [];
            for(const formula of cartEntity.cartFormulasByIdCart)  {
                items.push(initializeItem(formula));
            }
            for(const product of cartEntity.cartProductsByIdCart) {
                items.push(initializeItem(product))
            }
    
            return {
                amount: {
                    currency_code: 'EUR',
                    value: cartEntity.totalPrice + Checkout.GET_DELIVERY_PRICE(),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: cartEntity.totalPrice
                        },
                        shipping: {
                            currency_code: 'EUR',
                            value: Checkout.GET_DELIVERY_PRICE()
                        }
                    }
                },
                items: items
            };
        }
        const handleError = (err) => {
            console.error(err);
            frontEndLogService.saveLog(this.props.userEntity ? this.props.userEntity.idUser : 0, err);
            alert('Une erreur est survenue pendant le paiement. Vous n\'avez pas été débité.\nS\'il vous plaît, veuillez contacter un administrateur ou réessayer plus tard.');
        }
        window.paypal_sdk.Buttons({
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
                            country_code: 'FR'
                        },
                        phone: {
                            phone_type: 'MOBILE',
                            phone_number: {
                                national_number: '33' + props.userEntity.userPersonalInformationsByFkUserPersonalInformation.phone
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
    }, [props])

    return (
        <div>
            <div ref={paypal}/>
        </div>
    )
}