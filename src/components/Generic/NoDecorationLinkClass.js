import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';


export default class NoDecorationLink extends React.Component {
    
    render() {
        const NoDecorationLink = styled(Link)`
        &:focus, &:hover, &:visited, &:link, &:active {
            text-decoration: none
        }`;

        return (
            <NoDecorationLink {...this.props} />
        )
    }
}
