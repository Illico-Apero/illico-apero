import React        from 'react'
import Slide        from '@material-ui/core/Slide';
//import TextField    from '@material-ui/core/TextField';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state =
        {
            loaded: false,
        }
        this.validateForm = this.validateForm.bind(this);
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    validateForm() {

    }

    render() {
        return (
            <Slide  
            direction='down'
            in={this.state.loaded}
            mountOnEnter
            unmountOnExit
            timeout={800}>
                <div>
                    {/* TODO */ }
                    Login
                </div>
            </Slide>
        )
    }
}
