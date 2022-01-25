import React from 'react'
import Slide from '@material-ui/core/Slide';

export default class DefaultComponent extends React.Component {

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
		return (
			<Slide direction='down' in={this.state.loaded} mountOnEnter unmountOnExit timeout={800}>
				<div>
					DefaultComponent
				</div>
			</Slide>
		)
	}
}