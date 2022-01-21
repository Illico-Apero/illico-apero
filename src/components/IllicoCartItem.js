import React from 'react'
import Slide from '@material-ui/core/Slide';
import { Card, CardContent, CardMedia, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Utils from '../utils/Utils';
import CartEntity from '../models/CartEntity';
import ApiResponse from '../models/api/ApiResponse';
import CartService from '../network/services/CartService';
import DeleteIcon from '@material-ui/icons/Delete';


/**
 * @param {Function} onQuantityChange : the function (from cart.js) that will be called when quantity changes
 * @param {boolean} isCartFormula : indicates if given item is a formula (true) or a product (false)
 * @param {Object} item : can be either a product or a formula.
 * @param {Number} index : the item array index
 */
export default class IllicoCartItem extends React.Component {

    constructor(props) {
        super(props);
        let alt = '';
        let itemName = '';
        let imagePath = '';
        let itemId = 0;
        let itemQuantity = this.props.item.quantity;
        let price = 0;

        if(this.props.isCartFormula) {
            alt = this.props.item.formulaByFkFormula.name;
            itemName = this.props.item.formulaByFkFormula.name;
            imagePath = `../img/products/${this.props.item.formulaByFkFormula.picturePath}`
            itemId = this.props.item.formulaByFkFormula.idFormula
            price = this.props.item.formulaByFkFormula.price;
        }
        else {
            alt = this.props.item.productByFkProduct.name;
            itemName = this.props.item.productByFkProduct.name;
            imagePath = `../img/products/${this.props.item.productByFkProduct.picturePath}`
            itemId = this.props.item.productByFkProduct.idFormula;
            price = this.props.item.productByFkProduct.price;
        }

        this.state = {
            /** @type {CartEntity} cart */
            cart: this.props.cart,
            userEntity:this.props.userEntity,
            item: this.props.item,
            index: this.props.index,
            isCartFormula:this.props.isCartFormula,
            loaded: false,
            alt: alt,
            imagePath: imagePath,
            itemName: itemName,
            itemId: itemId,
            itemQuantity: itemQuantity,
            price:price,
            MAX_QUANTITY_VALUE: 10,
            cartPrice:this.props.cartPrice
        }
        this.cartService = new CartService();
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    render() {
        const cardRootStyle = {
            display:'flex',
            width:300,
            marginRight:'auto',
            marginLeft:'auto',
            marginBottom:'2em'
        }
        const cardDetailsStyle = {
            display:'flex',
            flexDirection:'column',
            textAlign:'left',
            position:'relative',
            width:220
        }

        const cardImageStyle = {
            width:150,
            maxHeight:180,
            aspectRatio:1/1,
        }

        return (
            <Card elevation={3} style={cardRootStyle}>
                <CardMedia
                    component="img"
                    alt={this.state.alt}
                    title={this.state.itemName}
                    image={this.state.imagePath}
                    style={cardImageStyle}
                />
                <CardContent style={cardDetailsStyle}>

                    <div style={{marginBottom:'1em'}}>
                        <Typography variant='body1' style= {{ color:'#b26a00'}}>
                        {this.state.itemName}
                        </Typography>                    
                        <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00',  fontSize:'0.8em', marginBottom:'0.3em'}}>
                            {(this.state.price).toFixed(2)}€
                        </Typography>
                    </div>
                    <div style={{bottom:0, flexDirection:'row'}}>
                        <FormControl variant='outlined' size='small'>
                            <InputLabel>Qté</InputLabel>
                            <Select 
                                label='Quantité'
                                labelId={`${this.state.itemName}-label`}
                                id={`${this.state.itemId}`}
                                value={this.props.item.quantity}
                                onChange={(event) => this.props.onQuantityChange(event, this.state.item, 
                                this.state.index, this.state.isCartFormula)}
                            >
                            {[...Array(this.state.MAX_QUANTITY_VALUE)].map((x, i) => 
                                    <MenuItem key={i} value={i} style={{
                                        paddingTop:'2px', minHeight:0, width:'60px'
                                    }}>{i}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <span style={{position:'absolute', marginLeft:'1em'}}>
                            <IconButton color='primary' aria-label='Suppr.' onClick={() => this.props.onQuantityChange(
                                null, this.state.item, this.state.index, this.state.isCartFormula)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                            </span>
                    </div>
                </CardContent>
            </Card>
        )
    }
}