import React from 'react'
import { Alert } from '@material-ui/lab';

export default class IllicoAlreadyConnected extends React.Component {
    render() {
        return (
          <Alert severity="warning" elevation={3} style={{ marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'320px',textAlign:'left'}}>
            Vous êtes déjà connecté(e) !
          </Alert>
        )
    }
}



