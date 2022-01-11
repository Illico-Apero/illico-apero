import React from 'react'
import Fade from '@material-ui/core/Fade';
import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";
import { Typography } from '@material-ui/core';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';

export default class LegalTerms extends IllicoReactComponent {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
		}
		this.defaultFunction = this.defaultFunction.bind(this);
	}

	componentDidMount() {
		this.setState({ loaded: true });
	}

	defaultFunction() {
		console.log("default");
	}


	render() {
		// according to the previous page passed within the props, we use it as a return page for the AppBar. By default, we use '/' (home)
		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);

		return (
			<Fade in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
				<div>
					<IllicoSimpleAppBar to={previousPageRedirection} title='Mentions légales (CGV/CGU)' />
					<Typography variant='h1'>
						Legal Terms : TODO
					</Typography>
				</div>
			</Fade>
		)
	}
}
