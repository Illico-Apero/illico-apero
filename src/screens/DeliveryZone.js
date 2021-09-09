import React from 'react'

import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'


export default class DeliveryZone extends React.Component {

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
            <div>
            <IllicoSimpleAppBar to={previousPageRedirection} title='Zone de livraison éligible'/>
                    <iframe title='Zone de livraison' src='https://www.google.com/maps/d/u/7/embed?mid=1H6RJdFJUEo1yU8Gkru2unwQFGlWEEuB7' width='320' height='500' style={{marginTop: '1em'}} />
            </div>
        )
    }
}
