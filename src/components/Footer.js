import React, { Component } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import IoniconsIcon from "react-native-vector-icons/dist/Ionicons";
import FeatherIcon from "react-native-vector-icons/dist/Feather";

function Footer(props) {
  return (
    <Container {...props}>
      <Link to="/Profile">
        <BtnWrapper1>
          <ButtonOverlay>
            <IoniconsIcon
              style={{ color: props.active ? "#007AFF" : "#616161" }}
              name="md-person"
              style={{
                backgroundColor: "transparent",
                fontSize: 24,
                opacity: 0.8
              }}
            ></IoniconsIcon>
            <Profile style={{ color: props.active ? "#007AFF" : "#9E9E9E" }}>
              Profile
            </Profile>
          </ButtonOverlay>
        </BtnWrapper1>
      </Link>
      <Link to="/Home">
        <BtnWrapper3>
          <ButtonOverlay>
            <IoniconsIcon
              name="md-home"
              style={{
                backgroundColor: "transparent",
                color: "#616161",
                fontSize: 24,
                opacity: 0.8
              }}
            ></IoniconsIcon>
            <Catalogue>Catalogue</Catalogue>
          </ButtonOverlay>
        </BtnWrapper3>
      </Link>
      <Link to="/Cart">
        <BtnWrapper4>
          <ButtonOverlay>
            <FeatherIcon
              name="shopping-cart"
              style={{
                backgroundColor: "transparent",
                color: "#616161",
                fontSize: 24,
                opacity: 0.8
              }}
            ></FeatherIcon>
            <Cart>Cart</Cart>
          </ButtonOverlay>
        </BtnWrapper4>
      </Link>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: rgba(255,255,255,1);
  flex-direction: row;
`;

const ButtonOverlay = styled.button`
 display: block;
 background: none;
 height: 100%;
 width: 100%;
 border:none
 `;
const BtnWrapper1 = styled.div`
  flex: 1 1 0%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: none;
  display: flex;
`;

const Profile = styled.span`
  font-family: Roboto;
  font-size: 12px;
  background-color: transparent;
  padding-top: 4px;
`;

const BtnWrapper3 = styled.div`
  flex: 1 1 0%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: none;
  display: flex;
`;

const Catalogue = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: #9E9E9E;
  background-color: transparent;
  padding-top: 4px;
`;

const BtnWrapper4 = styled.div`
  flex: 1 1 0%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: none;
  display: flex;
`;

const Cart = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: #9E9E9E;
  background-color: transparent;
  padding-top: 4px;
`;

export default Footer;
