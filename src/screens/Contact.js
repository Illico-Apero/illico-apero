import React from 'react'
import Fade from '@material-ui/core/Fade';
import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";
import { Typography } from '@material-ui/core';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';

export default class Contact extends IllicoReactComponent {

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
		// according to the previous page passed within the props, we use it as a return page for the AppBar. By default, we use '/' (home)
		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);

		return (
			<Fade in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
				<div>
					<IllicoSimpleAppBar to={previousPageRedirection} title='Nous contacter' />
					<Typography variant='h1'>
						Contact : TODO
					</Typography>
				</div>
			</Fade>
		)
	}
}
