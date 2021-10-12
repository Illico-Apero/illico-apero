import React from 'react'
import Fade from '@material-ui/core/Fade';
import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";
import { Typography } from '@material-ui/core';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'

export default class About extends React.Component {

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
        // according to the previous page passed within the props, we use it as a return page for the AppBar. By default, we use '/' (home)
        const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);

        return (
            <Fade in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
                <div>
                    <IllicoSimpleAppBar to={previousPageRedirection} title='À propos' />
                    <Typography variant='h1'>
                        A propos : TODO
                    </Typography>
                </div>
            </Fade>
        )
    }
}
