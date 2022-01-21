import React from 'react';
import Paper from '@material-ui/core/Paper';
import NoDecorationLink from './Generic/NoDecorationLink';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';


/**
 * Illico Apero Product Category
 * @param to: the redirection url
 * @param text: the text to display
 * @param color : the theme color
 */
class IllicoExceptionallyClosed extends React.Component
{
    render()
    {
        return(
					<Alert severity='error' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
						Les commandes sont fermées de manière exceptionnelle. Impossible de passer commande pour l'instant.
						Suivez-nous sur nos réseaux sociaux pour plus d'informations :
						<Typography variant='body1' style={{ textAlign: 'center' }}>
							<br />
							<a href='https://www.facebook.com/illico.apero.dijon'>Facebook</a>
							<br />
							<br />
							<a href='https://www.instagram.com/illico.apero.dijon/?hl=fr'>Instagram</a>
						</Typography>
					</Alert>
        );
    }
}

export default IllicoExceptionallyClosed;


