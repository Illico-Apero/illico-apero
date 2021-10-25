import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import ProductEntity from '../models/ProductEntity';
import { CircularProgress, Divider, Fade } from '@material-ui/core';
import IllicoAddToBasket from './IllicoAddToBasket';
import IllicoAudio from '../utils/IllicoAudio';

/**
 * Illico Apero Product
 * @param product the product entity
 * @param onBasketAddClick: the onClick function when adding to basket.
 */
class IllicoProduct extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            openProductInfo:false,
            imageLoaded:false
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    setOpenProductInfo(openProductInfo) {
        this.setState({openProductInfo: openProductInfo});
        if(openProductInfo) {
            IllicoAudio.playUiUnlockAudio();
        }
        else {
            IllicoAudio.playUiLockAudio();
        }
    }

    setImageLoaded(value) {
        this.setState({imageLoaded: value})
    }

    render()
    {
        /** @type {ProductEntity} */
        const product = this.props.product;
        return(
            <div style= {{
                marginBottom:'2em',
                aspectRatio:1/1,
                width:240,
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <Card elevation={3}>
                        <img
                            src={`../img/products/${product.picturePath}`}
                            alt={product.picturePath}
                            title={product.title}
                            onLoad={() => this.setImageLoaded(true)}
                            style={{
                                aspectRatio:1/1,
                                width:240,
                                display:this.state.imageLoaded ? 'block' : 'none'
                            }}
                        />
                    {
                        this.state.imageLoaded ? '' : <CircularProgress/>
                    }
                    <CardContent>
                    <Typography variant='subtitle1' style= {{ paddingTop:'0.1em', color:'#b26a00',fontWeight:'Bold', textAlign:'left'}}>
                        {product.name}
                    </Typography>
                    {/* TYPE */}
                    {
                        product.type !== null ?
                        <Typography variant='subtitle2' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontWeight:'Bold', textAlign:'left'}}>
                            {product.type}
                        </Typography>
                        :
                        ''
                    }
                    {/* ORIGINE */}
                    {
                        product.origin !== null ?
                        <Typography variant='subtitle2' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', textAlign:'left'}}>
                            {product.origin}
                        </Typography>
                        :
                        ''
                    }

                    {/* DESCRIPTION */}
                    {
                        product.description !== null ?
                        <div id="product-description">
                            <Collapse in={this.state.openProductInfo}>
                                <Alert severity='info' action={
                                    <IconButton aria-label='close' color='inherit' size='small' onClick={() => {this.setOpenProductInfo(false)}}>
                                        <CloseIcon fontSize='inherit'/>
                                    </IconButton>
                                }>
                                <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontSize:'0.9em', textAlign:'left'}}>
                                    {product.description}
                                </Typography>
                                </Alert>
                            </Collapse>
                            <IconButton disabled={this.state.openProductInfo} onClick={() => {this.setOpenProductInfo(true)}}>
                                <InfoIcon fontSize='inherit' color='primary'/>
                            </IconButton>
                        </div>
                        :
                        ''
                    }




                    <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontSize:'0.8em', textAlign:'left'}}>
                        {product.price + ' €'}
                    </Typography>
                    </CardContent>
                    <Divider/>
                    <CardActionArea onClick={this.props.onBasketAddClick}>
                        <IllicoAddToBasket/>
                    </CardActionArea>
                </Card>
            </div>
        );
    }
}

export default IllicoProduct;