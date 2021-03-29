import React, { Component } from "react";
import styled, { css } from "styled-components";
import Mail from "../components/Mail";
import Password from "../components/Password";
import FirstName from "../components/FirstName";
import Surname from "../components/Surname";
import Phone from "../components/Phone";
import Adress from "../components/Adress";
import RegisterButton from "../components/RegisterButton";
import MaterialCheckbox from "../components/MaterialCheckbox";

function Register(props) {
  return (
    <>
      <Inscription>Inscription</Inscription>
      <Mail
        style={{
          height: 43,
          width: 310,
          marginTop: 76,
          marginLeft: 33
        }}
      ></Mail>
      <Password
        style={{
          height: 43,
          width: 310,
          marginTop: 19,
          alignSelf: "center"
        }}
      ></Password>
      <FirstName
        style={{
          height: 43,
          width: 308,
          marginTop: 22,
          marginLeft: 34
        }}
      ></FirstName>
      <Surname
        style={{
          height: 43,
          width: 311,
          marginTop: 24,
          alignSelf: "center"
        }}
      ></Surname>
      <Phone
        style={{
          height: 43,
          width: 309,
          marginTop: 29,
          alignSelf: "center"
        }}
      ></Phone>
      <Adress
        style={{
          height: 43,
          width: 309,
          marginTop: 31,
          marginLeft: 33
        }}
      ></Adress>
      <RegisterButton
        style={{
          height: 44,
          width: 127,
          marginTop: 116,
          alignSelf: "center"
        }}
      ></RegisterButton>
      <MaterialCheckboxRow>
        <MaterialCheckbox
          style={{
            width: 46,
            height: 34,
            marginTop: 2
          }}
        ></MaterialCheckbox>
        <LoremIpsum>
          Je confirme être majeur et accepte{"\n"}les CGV et CGU
        </LoremIpsum>
      </MaterialCheckboxRow>
    </>
  );
}

const Inscription = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 400;
  color: rgba(220,145,96,1);
  height: 27px;
  width: 95px;
  font-size: 20px;
  margin-top: 60px;
  align-self: center;
`;

const LoremIpsum = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 400;
  color: rgba(74,74,74,1);
  margin-left: 2px;
`;

const MaterialCheckboxRow = styled.div`
  height: 38px;
  flex-direction: row;
  display: flex;
  margin-top: -127px;
  margin-left: 33px;
  margin-right: 81px;
`;

export default Register;
