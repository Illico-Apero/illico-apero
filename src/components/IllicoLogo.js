import React from 'react'
import logo from '../assets/logo.png'

/**
 * @param {Number} [width=130] : optional
 * @param {Number} [height=135] : optional
 */
export default class IllicoLogo extends React.Component {
    render() {
        return (
            <div>
                <img 
                    src={logo} 
                    alt='Illico Apéro'
                    width={this.props.width !== undefined ? this.props.width : 130}
                    height={this.props.height !== undefined ? this.props.height : 135}
                    style={this.props.style}
                />
            </div>
        )
    }
}
