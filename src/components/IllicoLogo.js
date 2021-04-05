import React from 'react'
import logo from '../assets/logo.png'

export default class IllicoLogo extends React.Component {
    render() {
        return (
            <div>
                <img 
                    src={logo} 
                    alt='Illico Apéro'
                    width={130}
                    height={135}
                    style={this.props.style}
                />
            </div>
        )
    }
}
