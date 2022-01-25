import React from 'react'
import Fade from '@material-ui/core/Fade';
import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";
import { Typography } from '@material-ui/core';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';

export default class About extends IllicoReactComponent {

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
					<IllicoSimpleAppBar to={previousPageRedirection} title='À propos' />
					<Typography variant='body1' style={{width:'70%', marginRight:'auto', marginLeft:'auto'}}>
						Illico Apéro est une société de vente en livraison de boissons pour l'apéritif ! Notre service propose de vous livrer
						alcools, softs et snacks en 30 minutes (en moyenne) sur Dijon et ses alentours !
						Actuellement au nombre de 3, nos coursiers se feront un plaisir de vous livrer pendant vos soirées. Alors n'hésitez plus !
					</Typography>
				</div>
			</Fade>
		)
	}
}
