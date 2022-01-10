import React from "react";

import Utils from "../utils/Utils";
import ApiResponse from "../models/api/ApiResponse";
import IllicoBottomNavigation from "../components/IllicoBottomNavigation";
import IllicoTopNavigation from "../components/IllicoTopNavigation";
import IllicoAskForConnection from "../components/IllicoAskForConnection";
import CartService from "../network/services/CartService";
import { Alert } from "@material-ui/lab";
import { Badge, Card, CardContent, CardMedia, CircularProgress, Divider, Grid, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import OrderService from "../network/services/OrderService";
import OrderEntity from "../models/OrderEntity";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      bottomNavigationValue: 0,
      isUserLoggedIn: false,
      userEntity: null,
      /** @type {OrderEntity[]} orders */
      orders: null,
    };

    this.cartService = new CartService();
    this.orderService = new OrderService();
  }

  retrieveQuantityInCart(callback) {
    Utils.handleEventuallyExpiredJwt(
      this.state.userEntity,
      (refreshedUserEntity) => {
        this.cartService.getAmountIncart(
          this.state.userEntity,
          this.state.userEntity.jwt,
          /** @param {ApiResponse} data */ (data) => {
            if (data.status === ApiResponse.GET_SUCCESS()) {
              // if API returned amount in cart
              this.setState({ quantityInCart: data.response }, () => {
                callback();
              });
            } else {
              // otherwise, keep going
              callback();
            }
          }
        );
      }
    );
  }

  componentDidMount() {
    if (!this.state.isUserLoggedIn || this.state.userEntity === null) {
      this.setState(
        { userEntity: JSON.parse(localStorage.getItem("userEntity")) },
        () => {
          this.setState(
            {
              isUserLoggedIn: JSON.parse(
                localStorage.getItem("isUserLoggedIn")
              ),
            },
            () => {
              if (this.state.isUserLoggedIn) {
                this.retrieveQuantityInCart(() => {
                  this.orderService.getOrders(this.state.userEntity, (data) => {
                    if (data.status === ApiResponse.GET_SUCCESS()) {
                      this.setState({ orders: data.response }, () => {
                        this.setState({ loaded: true });
                      });
                    } else {
                      this.setState({ loaded: true });
                    }
                  });
                });
              } else {
                this.setState({ loaded: true });
              }
            }
          );
        }
      );
    } else {
      this.retrieveQuantityInCart(() => {
        this.setState({ loaded: true });
      });
    }
  }

  render() {
    const loginRedirectState = {
      pathname: "/login",
      state: {
        backUrl: "/profile",
        slideDirection: "left",
      },
    };

    const cardRootStyle = { // duplicate
      display: 'flex',
      flexFlow: 'row wrap',
      alignContent: 'space-between',
      width:420,
      marginRight:'auto',
      marginLeft:'auto',
      marginBottom:'2em'
  } 

    return (
      <div>
        <IllicoTopNavigation
          title="Profil"
          backUrl="/profile"
          isUserLoggedIn={this.state.isUserLoggedIn}
          userEntity={this.state.userEntity}
        />
        {this.state.loaded ? (
          <>
            {this.state.isUserLoggedIn ? (
              <div id="profile">
                {this.state.orders !== null &&
                this.state.orders.length !== 0 ? (
                  <div id="orders" style={{ marginTop: "2em" }}>
                    {
                      this.state.orders.slice(0).reverse().map((order, index) => (
                        <div id={'order-' + index} key={index} style={{marginBottom:'2em'}}>
                          <Typography variant='h6' style={{ color:'#b26a00', marginBottom:'0.5em'}}>
                            Commande de {order.totalPrice.toFixed(2)}€ du {new Date(order.createdAt).toLocaleString()}
                          </Typography>
                          <div id='items-recap'>
                              <Grid container style={{marginTop:'2em'}}> 
                                <Card elevation={4} style={cardRootStyle}>
                                {
                                  order.orderFormulasByIdOrder.map(
                                      (orderFormula, index) => (
                                          <CardContent key={index}>
                                              <CardMedia
                                                  component="img"
                                                  alt={orderFormula.formulaByFkFormula.name}
                                                  title={orderFormula.formulaByFkFormula.name}
                                                  image={`../img/products/${orderFormula.formulaByFkFormula.picturePath}`}
                                                  style={{height:'65px'}}
                                              />
                                              <Badge badgeContent={orderFormula.quantity} color="primary"/>
                                          </CardContent>
                                      )
                                  )
                                }
                                {
                                    order.orderProductsByIdOrder.map(
                                        (orderProduct, index) => (
                                            <CardContent key={index}>
                                                <CardMedia
                                                    component="img"
                                                    alt={orderProduct.productByFkProduct.name}
                                                    title={orderProduct.productByFkProduct.name}
                                                    image={`../img/products/${orderProduct.productByFkProduct.picturePath}`}
                                                    style={{height:'65px'}}
                                                />
                                                <Badge badgeContent={orderProduct.quantity} color="primary"/>
                                            </CardContent>
                                        )
                                    )
                                }
                                </Card>
                              </Grid>
                            </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div id="no-orders">
                    <Alert
                      severity="info"
                      elevation={3}
                      style={{
                        marginTop: "2em",
                        marginBottom: "2em",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "260px",
                        textAlign: "left",
                      }}
                    >
                      Vous n'avez encore jamais passé commande 😭 !
                    </Alert>
                  </div>
                )}
              </div>
            ) : (
              <IllicoAskForConnection loginRedirectState={loginRedirectState} history={this.props.history} />
            )}
          </>
        ) : (
          <CircularProgress />
        )}
        <IllicoBottomNavigation
          bottomNavigationValue={this.state.bottomNavigationValue}
          quantityInCart={this.state.quantityInCart}
        />
      </div>
    );
  }
}
