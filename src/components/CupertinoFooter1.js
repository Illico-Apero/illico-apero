import React, { Component } from "react";
import styled, { css } from "styled-components";
import MaterialCommunityIconsIcon from "react-native-vector-icons/dist/MaterialCommunityIcons";

function CupertinoFooter1(props) {
  return (
    <Container {...props}>
      <BtnWrapper1>
        <ButtonOverlay>
          <MaterialCommunityIconsIcon
            style={{ color: props.active ? "#007AFF" : "#616161" }}
            name="av-timer"
            style={{
              backgroundColor: "transparent",
              fontSize: 24,
              opacity: 0.8
            }}
          ></MaterialCommunityIconsIcon>
          <Btn1Caption style={{ color: props.active ? "#007AFF" : "#9E9E9E" }}>
            Dashboard
          </Btn1Caption>
        </ButtonOverlay>
      </BtnWrapper1>
      <BtnWrapper2>
        <ButtonOverlay>
          <MaterialCommunityIconsIcon
            name="library-books"
            style={{
              backgroundColor: "transparent",
              color: "#616161",
              fontSize: 24,
              opacity: 0.8
            }}
          ></MaterialCommunityIconsIcon>
          <Btn2Caption>Orderbook</Btn2Caption>
        </ButtonOverlay>
      </BtnWrapper2>
      <BtnWrapper3>
        <ButtonOverlay>
          <MaterialCommunityIconsIcon
            name="poll"
            style={{
              backgroundColor: "transparent",
              color: "#616161",
              fontSize: 24,
              opacity: 0.8
            }}
          ></MaterialCommunityIconsIcon>
          <Btn3Caption>Stats</Btn3Caption>
        </ButtonOverlay>
      </BtnWrapper3>
      <BtnWrapper4>
        <ButtonOverlay>
          <MaterialCommunityIconsIcon
            name="credit-card"
            style={{
              backgroundColor: "transparent",
              color: "#616161",
              fontSize: 24,
              opacity: 0.8
            }}
          ></MaterialCommunityIconsIcon>
          <Btn4Caption>Payment</Btn4Caption>
        </ButtonOverlay>
      </BtnWrapper4>
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

const Btn1Caption = styled.span`
  font-family: Roboto;
  font-size: 12px;
  background-color: transparent;
  padding-top: 4px;
`;

const BtnWrapper2 = styled.div`
  flex: 1 1 0%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: none;
  display: flex;
`;

const Btn2Caption = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: #9E9E9E;
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

const Btn3Caption = styled.span`
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

const Btn4Caption = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: #9E9E9E;
  background-color: transparent;
  padding-top: 4px;
`;

export default CupertinoFooter1;
