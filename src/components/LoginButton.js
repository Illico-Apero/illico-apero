import React, { Component } from "react";
import styled, { css } from "styled-components";

function LoginButton(props) {
  return (
    <Container {...props}>
      <Connexion>CONNEXION</Connexion>
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

const Connexion = styled.span`
  font-family: Roboto;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-style: normal;
`;

export default LoginButton;
