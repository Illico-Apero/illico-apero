import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import IllicoAddToBasket from './IllicoAddToBasket';
import { Divider } from '@material-ui/core';
import IllicoAudio from '../utils/IllicoAudio';

/**
 * Illico Apero Product Category
 * @param image: the image path
 * @param title: the formula title
 * @param description: the formula description
 * @param price: the formula price
 * @param onBasketAddClick: the onClick function of the chip.
 */
class IllicoFormula extends React.Component
{
    render()
    {
        const disabledBackground = this.props.available ? {} : {backgroundColor:'#cfcfcf'};

        return(
            <div style= {{
                marginBottom:'2em',
                aspectRatio:1/2,
                width:300,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                <Card elevation={3} style={disabledBackground}>
                    <CardMedia
                        component="img"
                        alt={this.props.image}
                        title={this.props.title}
                        image={`../img/products/${this.props.image}`}
                        style={{
                            aspectRatio:1/1,
                            width:300
                        }}
                    />
                    <CardContent>
                        {
                            !this.props.available ?
                            <Typography variant='h6' gutterBottom style= {{ paddingTop:'0.1em', color:'#f72d05', fontWeight:'Bold', textAlign:'left'}}>
                                Ce produit est victime de son succès... 😫❌
                            </Typography>
                            :
                            ''
                        }
                        <Typography variant='subtitle1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontWeight:'Bold', textAlign:'left'}}>
                            {this.props.title}
                        </Typography>
                        <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontSize:'0.9em', textAlign:'left'}}>
                            {this.props.description}
                        </Typography>
                        <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontSize:'0.8em', textAlign:'left'}}>
                            {(this.props.price).toFixed(2)}€
                        </Typography>
                    </CardContent>
                    <Divider/>
                    <CardActionArea onClick={this.props.onBasketAddClick}>
                        <IllicoAddToBasket available={this.props.available}/>
                    </CardActionArea>
                </Card>
            </div>
        );
    }
}

export default IllicoFormula;