import React from 'react'

import Utils from '../utils/Utils';
import ApiResponse from '../models/api/ApiResponse';
import IllicoBottomNavigation from '../components/IllicoBottomNavigation';
import IllicoTopNavigation from '../components/IllicoTopNavigation';
import IllicoAskForConnection from '../components/IllicoAskForConnection';
import CartService from '../network/services/CartService';

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            bottomNavigationValue: 0,
            isUserLoggedIn: false,
            userEntity:null,
        }

        this.cartService = new CartService();
    }

    retrieveQuantityInCart(callback) {
        Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
            this.cartService.getAmountIncart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */ (data) => {
                if(data.status === ApiResponse.GET_SUCCESS()) { // if API returned amount in cart
                    this.setState({quantityInCart: data.response}, () => {
                        callback();
                    })
                }
                else { // otherwise, keep going
                    callback();
                }
            })
        });
    }

    componentDidMount() {
        if(!this.state.isUserLoggedIn || this.state.userEntity === null) {
            this.setState({userEntity: JSON.parse(localStorage.getItem('userEntity'))}, () => {
                this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
                    if(this.state.isUserLoggedIn) {
                        this.retrieveQuantityInCart(() => {
                            this.setState({loaded:true});
                        });
                    } else {
                        this.setState({loaded:true});
                    }
                });
            });
        } 
        else {
            this.retrieveQuantityInCart(() => {
                this.setState({loaded:true});
            });
        }
    }

    render() {
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/profile',
                slideDirection:'left',
            }
        }

        //TODO : see orders list
        return (
            <div>
                <IllicoTopNavigation title='Profil' backUrl='/profile' isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity} />
                    {
                        this.state.isUserLoggedIn ?
                        <div>
                            Todo.
                        </div>
                        :
                        <IllicoAskForConnection loginRedirectState={loginRedirectState}/>
                    }
                <IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart}/>
            </div>
        )
    }
}
