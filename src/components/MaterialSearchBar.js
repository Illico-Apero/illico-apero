import React, { Component } from "react";
import styled, { css } from "styled-components";
import MaterialCommunityIconsIcon from "react-native-vector-icons/dist/MaterialCommunityIcons";

function MaterialSearchBar(props) {
  return (
    <Container {...props}>
      <Rect1>
        <LeftIconButtonRow>
          <LeftIconButton>
            <ButtonOverlay>
              <MaterialCommunityIconsIcon
                name="arrow-left"
                style={{
                  backgroundColor: "transparent",
                  color: "#000",
                  fontSize: 24,
                  opacity: 0.6
                }}
              ></MaterialCommunityIconsIcon>
            </ButtonOverlay>
          </LeftIconButton>
          <InputStyle placeholder="Search"></InputStyle>
        </LeftIconButtonRow>
        <LeftIconButtonRowFiller></LeftIconButtonRowFiller>
        <RightIconButton>
          <ButtonOverlay>
            <MaterialCommunityIconsIcon
              name="close"
              style={{
                backgroundColor: "transparent",
                color: "#000",
                fontSize: 24,
                opacity: 0.6
              }}
            ></MaterialCommunityIconsIcon>
          </ButtonOverlay>
        </RightIconButton>
      </Rect1>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: #3F51B5;
  padding: 4px;
  flex-direction: column;
  box-shadow: 0px 2px 1.2px  0.2px #111 ;
`;

const ButtonOverlay = styled.button`
 display: block;
 background: none;
 height: 100%;
 width: 100%;
 border:none
 `;
const Rect1 = styled.div`
  flex-direction: row;
  background-color: #FFFFFF;
  align-items: center;
  border-radius: 2px;
  flex: 1 1 0%;
  margin-bottom: 4px;
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
  display: flex;
`;

const LeftIconButton = styled.div`
  padding: 11px;
  flex-direction: column;
  display: flex;
  margin-top: 1px;
  border: none;
`;

const InputStyle = styled.input`
  font-family: Roboto;
  height: 48px;
  color: #000;
  padding-right: 5px;
  font-size: 16px;
  align-self: flex-start;
  width: 257px;
  line-height: 16px;
  margin-left: 45px;
  border: none;
  background: transparent;
`;

const LeftIconButtonRow = styled.div`
  height: 48px;
  flex-direction: row;
  margin-left: 5px;
  margin-top: 4px;
  display: flex;
`;

const LeftIconButtonRowFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: row;
  display: flex;
`;

const RightIconButton = styled.div`
  padding: 11px;
  align-items: center;
  flex-direction: column;
  display: flex;
  margin-right: 5px;
  margin-top: 5px;
  border: none;
`;

export default MaterialSearchBar;
