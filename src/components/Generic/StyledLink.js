import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: underline;
        color: #43a6f7
    }
`;

const styledLinkExport = (props) => <StyledLink {...props} />;

export default styledLinkExport;