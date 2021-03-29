import React, { Component } from "react";
import styled, { css } from "styled-components";
import CatalogueButton from "../components/CatalogueButton";
import InscriptionButton from "../components/InscriptionButton";

function Landing(props) {
  return (
    <Container
        style=
        {{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>

        <IllicoBgStack>
        <svg
          viewBox="0 0 135.93 132.19"
          style={{
            top: 0,
            width: 136,
            height: 132,
            opacity: 0.43,
          }}>
          <ellipse
            stroke="rgba(230, 230, 230,1)"
            strokeWidth={0}
            fill="rgba(255,222,170,1)"
            cx={68}
            cy={66}
            rx={68}
            ry={66}
          ></ellipse>
        </svg>
        <IllicoLogo src={require("../assets/images/Logo_v11.png")}></IllicoLogo>
      </IllicoBgStack>
      <Welcome>Bienvenue chez Illico Apéro !</Welcome>
      <GeneralInfos>
        Vente d&#39;alcool en livraison{"\n"}sur l&#39;agglomération de Dijon{" "}
        {"\n"}entre [hh:mm] et [hh:mm]{"\n"}du [J] au [J]
      </GeneralInfos>
      <OpeningInfosStack>
        <OpeningInfos>
          Nous sommes actuellement ouvert,{"\n"}consultez dès maintenant notre
          catalogue !
        </OpeningInfos>
        <OpeningInfosBg></OpeningInfosBg>
      </OpeningInfosStack>
      <CatalogueButton
        style={{
          height: 45,
          width: 210,
          marginTop: 55,
          marginLeft: 83,
        }}
      ></CatalogueButton>
      <InscriptionButton
        style={{
          height: 44,
          width: 212,
          marginTop: 16,
          alignSelf: "center",
        }}
      ></InscriptionButton>
      <DejaInscrit>Déjà inscrit ?</DejaInscrit>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const IllicoLogo = styled.img`
  top: 6px;
  width: 122px;
  height: 122px;
  position: absolute;
  left: 7px;
  object-fit: contain;
`;

const IllicoBgStack = styled.div`
  width: 136px;
  height: 132px;
  margin-top: 153px;
  margin-left: 120px;
  position: relative;
`;

const Welcome = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 400;
  color: rgba(220, 145, 96, 1);
  height: 33px;
  width: 263px;
  font-size: 20px;
  margin-top: -199px;
  align-self: center;
`;

const GeneralInfos = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  font-size: 15px;
  text-align: center;
  margin-top: 195px;
  margin-left: 91px;
`;

const OpeningInfos = styled.span`
  font-family: Nunito;
  top: 5px;
  position: absolute;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  font-size: 15px;
  text-align: center;
  left: 6px;
`;

const OpeningInfosBg = styled.div`
  top: 0px;
  width: 299px;
  height: 54px;
  position: absolute;
  background-color: rgba(128, 245, 53, 1);
  opacity: 0.16;
  left: 0px;
`;

const OpeningInfosStack = styled.div`
  width: 299px;
  height: 54px;
  margin-top: 41px;
  margin-left: 38px;
  position: relative;
`;

const DejaInscrit = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 700;
  color: rgba(74, 144, 226, 1);
  text-decoration-line: underline;
  margin-top: 15px;
  align-self: center;
`;

export default Landing;
