import React, { Component } from "react";
import styled, { css } from "styled-components";

function ProfileNotRegistered(props) {
  return (
    <LoremIpsum>
      "Page de connexion/{"\n"}register (2 boutons{"\n"}comme le landing){"\n"}
      -&gt; lorsque l&#39;utilisateur{"\n"}veut aller sur profil{"\n"}alors
      qu&#39;il n&#39;est pas co"
    </LoremIpsum>
  );
}

const LoremIpsum = styled.span`
  font-family: Roboto;
  font-postscript-name: roboto-regular;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  margin-top: 202px;
  margin-left: 147px;
  display: flex;
`;

export default ProfileNotRegistered;
