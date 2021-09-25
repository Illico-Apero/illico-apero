import React from 'react'
import { Alert } from '@material-ui/lab';

export default class Closed extends React.Component {
    render() {
        return (
            <Alert 
                severity="error" 
                elevation={3}
                style=
                {{
                    marginTop:'2em',
                    marginBottom:'2em',
                    marginLeft:'auto',
                    marginRight:'auto',

                    width:'260px',
                    textAlign:'left',
                    fontFamily:'Tisa'
                }}>
                Nous sommes actuellement fermés 😪 {'\n'}
                Vous pouvez tout de même consulter {'\n'}
                notre catalogue !
        </Alert>
        )
    }
}
