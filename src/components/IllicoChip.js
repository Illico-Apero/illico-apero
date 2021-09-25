import React from 'react';
import Paper from '@material-ui/core/Paper';
import NoDecorationLink from './Generic/NoDecorationLink';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';


/**
 * Illico Apero Product Category
 * @param to: the redirection url
 * @param text: the text to display
 * @param color : the theme color
 */
class IllicoChip extends React.Component
{
    render()
    {
        return(
            <NoDecorationLink to={this.props.to}>
                <Chip label={this.props.text} color={this.props.color} clickable style={{marginBottom:'0.4em', 
                fontWeight:'bold', color:'#ffffff', fontFamily:'Tisa'}}
                />
            </NoDecorationLink>
        );
    }
}

export default IllicoChip;