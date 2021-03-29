import React, { Component } from "react";
import styled, { css } from "styled-components";
import MaterialCommunityIconsIcon from "react-native-vector-icons/dist/MaterialCommunityIcons";

function CupertinoSearchBarBasic(props) {
  return (
    <Container {...props}>
      <InputBox>
        <MaterialCommunityIconsIcon
          name="magnify"
          style={{
            color: "#000",
            fontSize: 20,
            alignSelf: "center",
            paddingLeft: 5,
            paddingRight: 5
          }}
        ></MaterialCommunityIconsIcon>
        <InputStyle placeholder="Search"></InputStyle>
      </InputBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #CECED2;
  padding: 8px;
`;

const InputBox = styled.div`
  flex: 1 1 0%;
  flex-direction: row;
  background-color: #EFEFF4;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const InputStyle = styled.input`
  font-family: Roboto;
  height: 32px;
  align-self: flex-start;
  font-size: 15px;
  line-height: 15px;
  color: #000;
  flex: 1 1 0%;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

export default CupertinoSearchBarBasic;
