import React from 'react'
import logo from '../assets/logo_top.png'

/**
 * @param {Number} [width=800] : optional
 * @param {Number} [height=250] : optional
 */
export default class IllicoTopLogo extends React.Component {
    render() {
        return (
            <div>
                <img 
                    src={logo} 
                    alt='Illico Apéro'
                    width={this.props.width !== undefined ? this.props.width : 800}
                    height={this.props.height !== undefined ? this.props.height : 250}
                    style={this.props.style}
                />
            </div>
        )
    }
}
