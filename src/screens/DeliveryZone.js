import { CircularProgress } from '@material-ui/core';
import React from 'react'

import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'


export default class DeliveryZone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            loadingMap:true
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }



    render() {

        const deliveryZoneRedirectState = {
            pathname: '/register',
            state: {
                backUrl:'/'
            }
        }
        // according to the previous page passed within the props, we use it as a return page for the AppBar. By default, we use '/' (home)

        return (
            <div>
            <IllicoSimpleAppBar to={deliveryZoneRedirectState} title='Zone de livraison éligible'/>
                <div>
                    {
                        this.state.loadingMap ?
                        (<CircularProgress/>) : null
                    }
                </div>
                <iframe title='Zone de livraison' src='https://www.google.com/maps/d/u/7/embed?mid=1YcDz6iXrPTfl-pG2Maao8EnNaZoxNnYL' width='320' height='500' style={{marginTop: '1em'}} onLoad={() => this.setState({loadingMap:false})}/>
            </div>
        )
    }
}
