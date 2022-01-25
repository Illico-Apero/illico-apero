import React from 'react'
import Fade from '@material-ui/core/Fade';
import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";
import { Typography } from '@material-ui/core';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import { Link } from 'react-router-dom';

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
					<IllicoSimpleAppBar to={previousPageRedirection} title='Mentions légales' />

					<Typography variant='body1' style={{marginBottom:'2em', width:'90%', marginRight:'auto', marginLeft:'auto'}}>
					Illico Apéro permet la vente en ligne d'alcools et de produits apéritifs en livraison rapide.
					Nous intervenons sur l'agglomération de Dijon et alentours, les addresses éligibles à la livraison sont situées dans un rayon de 5km autour du centre de Dijon :
					</Typography>
					<img style={{maxWidth:'100%', maxHeight:'100%', marginBottom:'2em'}} alt='Zone de livraison' src='/img/delivery_zone.png'/>


					<Typography variant='h4' style={{marginBottom:'1em'}}>
						Conditions générales d'utilisation
					</Typography>
					<iframe title='cgu' src="/pdf/cgu.pdf" width="90%" height="600px" style={{marginBottom:'5em'}}/>

					<Typography variant='h4' style={{marginBottom:'1em'}}>
						Conditions générales de vente
					</Typography>
					<iframe title='cgu' src="/pdf/cgv.pdf" width="90%" height="600px" style={{marginBottom:'5em'}}/>
				</div>
			</Fade>
		)
	}
}
