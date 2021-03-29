import React, { Component } from "react";
import styled, { css } from "styled-components";

function Cart(props) {
  return (
    <Stack>
      <LoremIpsum>Lorem Ipsum</LoremIpsum>
      <LoremIpsum3>Bienvenue sur la page du panier</LoremIpsum3>
    </Stack>
  );
}

const Stack = styled.div`
  width: 253px;
  height: 25px;
  margin-top: 146px;
  margin-left: 57px;
  position: relative;
  display: flex;
`;

const LoremIpsum = styled.span`
  font-family: Roboto;
  top: 0px;
  left: 0px;
  position: absolute;
  font-style: normal;
  font-weight: 400;
  color: #121212;
`;

const LoremIpsum3 = styled.span`
  font-family: Roboto;
  top: 8px;
  left: 56px;
  position: absolute;
  font-style: normal;
  font-weight: 400;
  color: #121212;
`;

export default Cart;
