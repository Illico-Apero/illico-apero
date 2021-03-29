import React, { Component } from "react";
import styled, { css } from "styled-components";

function RegisterButton(props) {
  return (
    <Container {...props}>
      <Confirmer>CONFIRMER</Confirmer>
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

const Confirmer = styled.span`
  font-family: Roboto;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-style: normal;
`;

export default RegisterButton;
