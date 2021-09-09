import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NoDecorationLink = styled(Link)`

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none
    }
`;

const noDecorationLink = (props) => <NoDecorationLink {...props} />;

export default noDecorationLink;