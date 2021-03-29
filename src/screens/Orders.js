import React, { Component } from "react";
import styled, { css } from "styled-components";

function Orders(props) {
  return (
    <LoremIpsum>
      "Bienvenue sur la page de vos commandes {"\n"}&#39;(profil-&gt;commande)"
    </LoremIpsum>
  );
}

const LoremIpsum = styled.span`
  font-family: Roboto;
  font-postscript-name: roboto-regular;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  margin-top: 150px;
  margin-left: 45px;
  display: flex;
`;

export default Orders;
