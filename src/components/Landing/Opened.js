import React from 'react'
import { Alert } from '@material-ui/lab';

export default class Opened extends React.Component {
    render() {
        return (
            <Alert 
                severity="success" 
                style=
                {{
                    marginTop:'3%',
                    marginBottom:'3%',
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
