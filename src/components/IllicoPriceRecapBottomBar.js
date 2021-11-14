 import React from 'react'
import Slide from '@material-ui/core/Slide';
import { AppBar, Paper } from '@material-ui/core';

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
            <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0, fontSize:'12px', textAlign:'left', paddingLeft:'0.5em'}}>
                Total avec livraison : {(this.props.price).toFixed(2)}€
            </AppBar>
        )
    }
}