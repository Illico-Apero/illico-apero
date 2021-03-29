import React, { Component } from "react";
import styled, { css } from "styled-components";

function InscriptionButton(props) {
  return (
    <Container {...props}>
      <Inscription>INSCRIPTION</Inscription>
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

const Inscription = styled.span`
  font-family: Roboto;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-style: normal;
`;

export default InscriptionButton;
