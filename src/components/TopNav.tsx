import React from "react";
import styled from "styled-components";
import CVSU_LOGO from "../assets/cvsu_logo/cvsu_logo.png";
import Colors from "../constants/Colors";
import "../index.css";
import { FaBars, FaUserCircle } from "react-icons/fa";

export default function TopNav() {
  const user = localStorage.getItem("user");
  return (
    <Container>
      <TopNavLeftContent>
        {user && (
          <BurgerContainer>
            <FaBars size={20} color="white" />
          </BurgerContainer>
        )}
        <CvsuLogo src={CVSU_LOGO} />
        <TopNavTitleText>
          Digitized Document Processing System of the CvSU Faculty Workload
        </TopNavTitleText>
      </TopNavLeftContent>
      <TopNavRightContent>
        <FaUserCircle size={25} color="white" />
      </TopNavRightContent>
    </Container>
  );
}

const Container = styled.div`
  background: ${Colors.primary};
  width: 100%;
  height: 54px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
`;

const TopNavLeftContent = styled.div`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  display: flex;
  padding-left: 12px;
`;

const CvsuLogo = styled.img`
  width: 55px;
  height: 45px;
`;

const TopNavTitleText = styled.text`
  font-size: 12px;
  margin-left: 20px;
  color: ${Colors.primaryHeaderText};
  font-family: HurmeGeometricSans3Bold;
  font-weight: 700;
`;

const BurgerContainer = styled.div`
  margin: 0px 20px 0px 10px;
`;

const TopNavRightContent = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  padding-right: 40px;
`;
