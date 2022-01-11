import React from 'react'
import Slide from '@material-ui/core/Slide';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';

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
					<div></div>
				</Slide>
			</div>
		)
	}
}