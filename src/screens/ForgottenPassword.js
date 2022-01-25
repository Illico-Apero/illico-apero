import React from 'react'
import Slide from '@material-ui/core/Slide';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import { Alert } from '@material-ui/lab';

export default class ForgottenPassword extends IllicoReactComponent {

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
		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideLeft(this.props.location);
		// en bas par défaut ou bien donné par les props
		const slideDirection = RedirectionStateHandler.getSlideDirection('down', this.props.location);
		return (
			<div>
				<IllicoSimpleAppBar to={previousPageRedirection} title='Mot de passe oublié ?' />
				<Slide direction={slideDirection} in={this.state.loaded} mountOnEnter unmountOnExit timeout={800}>
					<div>
					<Alert severity='info' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
						Cette fonctionnalité n'est pas encore disponible 😥. Contactez-nous si vous rencontrez des soucis de connexion.
					</Alert>
					</div>
				</Slide>
			</div>
		)
	}
}