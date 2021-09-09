import React from 'react'
import { Alert } from '@material-ui/lab';

export default class Opened extends React.Component {
    render() {
        return (
            <Alert 
                severity="success" 
                style=
                {{
                    marginTop:'2em',
                    marginBottom:'2em',
                    marginLeft:'auto',
                    marginRight:'auto',

                    width:'310px',
                    textAlign:'left'
                }}>
                Nous sommes actuellement ouvert ! 🍻🎉
            </Alert>
        )
    }
}
