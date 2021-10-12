import React from 'react';
import Paper from '@material-ui/core/Paper';
import NoDecorationLink from './Generic/NoDecorationLink';
import { CircularProgress } from '@material-ui/core';


/**
 * Illico Apero Product Category
 * @param image: the image path
 * @param to: the redirection url
 */
class IllicoCategory extends React.Component
{
    render()
    {
        /* woopsi ... */
        let img = this.props.image;
        if(img === 'Bière') img = 'Biere';
        /*            */

        return(
            <div style= {{
                marginBottom:'2em',
                aspectRatio:1/1,
                width:210,
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <NoDecorationLink to={this.props.to}>
                    <Paper elevation={3} >
                        <img src={`../img/products/categories/${img}.jpg`} 
                            alt={this.props.image}
                            style={{
                                aspectRatio:1/1,
                                width:200,
                            }}
                        />
                    </Paper>
                </NoDecorationLink>
            </div>
        );
    }
}

export default IllicoCategory;