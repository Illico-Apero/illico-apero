import React, { Component } from "react";
import styled, { css } from "styled-components";
import Footer from "../components/Footer";
import IoniconsIcon from "react-native-vector-icons/dist/Ionicons";
import Search from "../components/Search";

function Home(props) {
  return (
    <Container>
      <CupertinoFooter11Row>
        <Footer
          style={{
            height: 49,
            width: 375,
            marginTop: 498
          }}
        ></Footer>
        <Todo6CasesFixe>
          todo : 6 cases fixe : spiritueux, vins, bières, champagnes, softs,
          apéritifs
        </Todo6CasesFixe>
        <TitreNosProduits>Titre : Nos produits</TitreNosProduits>
        <NosFormulesStack>
          <NosFormules>Titre : A ne pas manquer</NosFormules>
          <Todo7>Todo 1 case tout en largeur &quot;Nos formules</Todo7>
        </NosFormulesStack>
      </CupertinoFooter11Row>
      <CupertinoFooter11RowFiller>
        <IconRow>
          <IoniconsIcon
            name="ios-information-circle-outline"
            style={{
              color: "rgba(126,211,33,1)",
              fontSize: 30,
              marginTop: 3
            }}
          ></IoniconsIcon>
          <IconFiller></IconFiller>
          <IllicoLogo1
            src={require("../assets/images/Logo_v11.png")}
          ></IllicoLogo1>
        </IconRow>
        <Search
          style={{
            height: 44,
            width: 375,
            marginTop: 81,
            marginLeft: 0
          }}
        ></Search>
      </CupertinoFooter11RowFiller>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
`;

const Todo6CasesFixe = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 115px;
  width: 131px;
  margin-left: -352px;
  margin-top: 54px;
`;

const TitreNosProduits = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 51px;
  width: 85px;
  margin-left: -137px;
`;

const NosFormules = styled.span`
  font-family: Roboto;
  top: 0px;
  left: 0px;
  position: absolute;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 51px;
  width: 85px;
`;

const Todo7 = styled.span`
  font-family: Roboto;
  top: 44px;
  left: 40px;
  position: absolute;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 56px;
  width: 131px;
`;

const NosFormulesStack = styled.div`
  width: 171px;
  height: 100px;
  margin-left: -85px;
  margin-top: 184px;
  position: relative;
`;

const CupertinoFooter11Row = styled.div`
  height: 547px;
  flex-direction: row;
  margin-top: 181px;
  display: flex;
`;

const IconFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: row;
  display: flex;
`;

const IllicoLogo1 = styled.img`
  width: 100%;
  height: 41px;
  margin-top: -1px;
  object-fit: contain;
`;

const IconRow = styled.div`
  height: 41px;
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
  margin-right: -375px;
  margin-left: 5px;
  margin-top: 37px;
`;

const CupertinoFooter11RowFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: row;
  display: flex;
`;

export default Home;
