import React from "react";
import styled from "styled-components";
import CVSU_LOGO from "../assets/cvsu_logo/cvsu_logo.png";
import Colors from "../constants/Colors";
import "../index.css";
import { FaUserCircle } from "react-icons/fa";

type TopNavProps = {
  profileHandler?: () => void;
};

export default function TopNav({ profileHandler }: TopNavProps) {
  const user = localStorage.getItem("userId");
  return (
    <Container>
      <TopNavLeftContent>
        <CvsuLogo src={CVSU_LOGO} />
        <TopNavTitleText>
          Digitized Document Processing System of the CvSU Faculty Workload
        </TopNavTitleText>
      </TopNavLeftContent>
      {user && (
        <TopNavRightContent onClick={profileHandler}>
          <FaUserCircle size={25} color="white" />
        </TopNavRightContent>
      )}
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
  position: fixed;
  z-index: 1;
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

const TopNavTitleText = styled.span`
  font-size: 15px;
  margin-left: 20px;
  color: ${Colors.primaryHeaderText};
  font-family: HurmeGeometricSans3Bold;
  font-weight: 700;
`;

const TopNavRightContent = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  padding-right: 40px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 0.5;
  }
`;
