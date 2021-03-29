import React, { Component } from "react";
import styled, { css } from "styled-components";

function CatalogueButton(props) {
  return (
    <Container {...props}>
      <Catalogue>CATALOGUE</Catalogue>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: #FFCC00;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 5px;
  padding-left: 16px;
  padding-right: 16px;
`;

const Catalogue = styled.span`
  font-family: Roboto;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-style: normal;
`;

export default CatalogueButton;
