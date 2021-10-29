 import React from 'react'
import Slide from '@material-ui/core/Slide';
import { AppBar, Paper } from '@material-ui/core';

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
            <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0}}>

            </AppBar>
        )
    }
}