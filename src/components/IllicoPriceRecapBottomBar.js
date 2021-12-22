 import React from 'react'
import Slide from '@material-ui/core/Slide';
import { AppBar, Paper, Typography } from '@material-ui/core';

/**
 * @param {String} price
 */
export default class IllicoPriceRecapBottomBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    render() {
        return (
            <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0, textAlign:'left', paddingLeft:'0.5em'}}>
                <Typography variant='body1' style={{fontSize:'16px', marginLeft:'auto', marginRight:'auto'}}>
                    Total avec livraison : {(this.props.price).toFixed(2)}€
                </Typography>
            </AppBar>
        )
    }
}