import { CircularProgress } from '@material-ui/core';
import React from 'react'
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';

import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'


export default class DeliveryZone extends IllicoReactComponent {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
		}
	}

	componentDidMount() {
		this.setState({ loaded: true });
	}



	render() {

		const deliveryZoneRedirectState = {
			pathname: '/register',
			state: {
				backUrl: '/'
			}
		}
		// according to the previous page passed within the props, we use it as a return page for the AppBar. By default, we use '/' (home)

		return (
			<div>
				<IllicoSimpleAppBar to={deliveryZoneRedirectState} title='Zone de livraison éligible' />
				<div>
				</div>
				<img style={{maxWidth:'100%', maxHeight:'100%'}} alt='Zone de livraison' src='/img/delivery_zone.png'/>
			</div>
		)
	}
}
