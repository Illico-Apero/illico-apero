import React from 'react'
import { Alert } from '@material-ui/lab';

export default class Closed extends React.Component {
    render() {
        return (
            <Alert 
                severity="error" 
                style=
                {{
                    marginTop:'3%',
                    marginBottom:'3%',
                    marginLeft:'auto',
                    marginRight:'auto',

                    width:'290px',
                    textAlign:'left'
                }}>
                Nous sommes actuellement fermés 😪 {'\n'}
                Vous pouvez tout de même consulter {'\n'}
                notre catalogue !
        </Alert>
        )
    }
}
