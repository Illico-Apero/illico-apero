import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import IllicoAudio from '../utils/IllicoAudio';

/**
 * Basic App Bar
 * @param to : the redirection path of the back button or the redirection object (pathName + state)
 * @param title : the title of the app bar
 * add a custom text
 */
export class IllicoSimpleAppBar extends React.Component {
    render() {
        return (
            <AppBar position='static' style={{ marginBottom: '1.5em' }}>
                <Toolbar>
                    <IconButton component={Link} edge='start' aria-label='back' to={this.props.to} onClick={() => IllicoAudio.playNavigationBackwardAudio()}>
                        <ArrowBackIosIcon color='action' />
                    </IconButton>
                    <Typography variant='h5' style={{ color: '#fff', fontWeight: 'bold' }}>
                        {this.props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

export default IllicoSimpleAppBar;
