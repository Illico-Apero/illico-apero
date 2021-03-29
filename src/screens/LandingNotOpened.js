import React, { Component } from "react";
import styled, { css } from "styled-components";

function LandingNotOpened(props) {
  return (
    <Container>
      <IllicoBgStack>
        <svg
          viewBox="0 0 135.93 132.19"
          style={{
            top: 0,
            width: 136,
            height: 132,
            position: "absolute",
            opacity: 0.43,
            left: 0
          }}
        >
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
      <OpeningInfosBg>
        <OpeningInfos>
          Nous sommes actuellement fermé, mais{"\n"}vous pouvez consulter notre
          catalogue !
        </OpeningInfos>
      </OpeningInfosBg>
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
  color: rgba(220,145,96,1);
  height: 33px;
  width: 263px;
  font-size: 20px;
  margin-top: -199px;
  margin-left: 60px;
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

const OpeningInfosBg = styled.div`
  width: 299px;
  height: 54px;
  background-color: rgba(245,53,60,0.16);
  flex-direction: column;
  display: flex;
  margin-top: 27px;
  margin-left: 38px;
`;

const OpeningInfos = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  font-size: 15px;
  text-align: center;
  margin-top: 7px;
  margin-left: 15px;
`;

export default LandingNotOpened;
