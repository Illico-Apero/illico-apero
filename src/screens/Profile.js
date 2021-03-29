import React, { Component } from "react";
import styled, { css } from "styled-components";

function Profile(props) {
  return <LoremIpsum>"Bienvenue sur la page du profil"</LoremIpsum>;
}

const LoremIpsum = styled.span`
  font-family: Roboto;
  font-postscript-name: roboto-regular;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 150px;
  width: 164px;
  margin-top: 146px;
  margin-left: 65px;
  display: flex;
`;

export default Profile;
