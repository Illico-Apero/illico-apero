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
        return(
            <div style= {{
                marginBottom:'2em',
                aspectRatio:1/2,
                width:400,
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <Card elevation={3}>
                    <CardMedia
                        component="img"
                        alt={this.props.image}
                        title={this.props.title}
                        image={`../img/products/${this.props.image}`}
                        style={{
                            aspectRatio:1/1,
                            width:400
                        }}
                    />
                    <CardContent>
                        <Typography variant='subtitle1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontFamily:'Tisa', fontWeight:'Bold', textAlign:'left'}}>
                            {this.props.title}
                        </Typography>
                        <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontFamily:'Tisa', fontSize:'0.9em', textAlign:'left'}}>
                            {this.props.description}
                        </Typography>
                        <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontFamily:'Tisa', fontSize:'0.8em', textAlign:'left'}}>
                            {this.props.price + ' €'}
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

export default IllicoFormula;