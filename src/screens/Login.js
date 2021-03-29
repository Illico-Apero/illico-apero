import React, { Component } from "react";
import styled, { css } from "styled-components";
import Mail from "../components/Mail";
import Password from "../components/Password";
import LoginButton from "../components/LoginButton";

function Login(props) {
  return (
    <>
      <Mail
        style={{
          height: 43,
          width: 310,
          marginTop: 155,
          alignSelf: "center"
        }}
      ></Mail>
      <Password
        style={{
          height: 43,
          width: 310,
          marginTop: 38,
          alignSelf: "center"
        }}
      ></Password>
      <Connexion>Connexion</Connexion>
      <LoginButton
        style={{
          height: 44,
          width: 128,
          marginTop: 225,
          alignSelf: "center"
        }}
      ></LoginButton>
      <LoremIpsum>Mot de passe oublié ?</LoremIpsum>
    </>
  );
}

const Connexion = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 400;
  color: rgba(220,145,96,1);
  height: 27px;
  width: 95px;
  font-size: 20px;
  margin-top: -219px;
  align-self: center;
`;

const LoremIpsum = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 700;
  color: rgba(26,163,255,1);
  height: 22px;
  width: 147px;
  text-decoration-line: underline;
  margin-top: 28px;
  margin-left: 119px;
`;

export default Login;
