import { Card, Layout } from "antd";
import styled from "styled-components";
import AppScrollbar from "@crema/components/AppScrollbar";

export const StyledAuthWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const StyledAuthCard = styled(Card)`
  max-width: 900px;
  min-height: 350px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 0 none;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    min-height: 450px;
  }

  & .ant-card-body {
    padding: 0;
    display: flex;
    flex: 1;
  }
`;

export const StyledAuthMainContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 20px;
    width: 50%;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    width: 40%;
    padding: 40px;
  }
`;

export const StyledAuthCardHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    margin-bottom: 36px;
  }

  & img {
    cursor: pointer;
    height: 36px;
    margin-right: 10px;

    [dir="rtl"] & {
      margin-right: 0;
      margin-left: 10px;
    }
  }
`;

export const StyledAuthWellAction = styled.div`
  position: relative;
  padding: 24px;
  display: none;
  background-color: ${({ theme }) => theme.palette.gray[900]};
  color: white;
  font-size: ${({ theme }) => theme.font.size.base};
  width: 100%;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 50%;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    width: 60%;
    padding: 40px;
  }

  & h2 {
    color: white;
    font-size: 30px;
    font-weight: ${({ theme }) => theme.font.weight.bold};
  }

  & p {
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const StyledAuthWelContent = styled.div`
  max-width: 320px;
`;

export const StyledAuth = styled(Layout)`
  flex: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  //background-color: @primary-color;

  & .ant-layout-content {
    padding: 20px;
    justify-content: center;
    display: flex;
  }

  & .main-auth-scrollbar {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  & .footer {
    margin-right: 0;
    margin-left: 0;
  }
`;

export const StyledMainAuthScrollbar = styled(AppScrollbar)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const StyledAuthLink = styled.span`
  color: ${({ theme }) => theme.palette.white};
  font-size: ${({ theme }) => theme.font.size.lg};
  cursor: pointer;
  font-weight: 500;
  margin-left: 5px;
  text-align: right;
  display: block;

  [dir="rtl"] & {
    text-align: left;
  }
`;

export const StyledAuthFooter = styled.div`
  color: ${({ theme }) => theme.palette.white};
  font-size: ${({ theme }) => theme.font.size.base};
  bottom: 20px;
  position: absolute;
  display: grid;
  text-align: center;
`;

export const StyledAuthFooterContent = styled.span`
  & a {
    margin-left: 5px;
    margin-left: 5px;
  }`;

export const StyledAuthFooterLinks = styled.ul`
  display: flex;
  & li {
    margin-left: 5px;
  }
`;

export const StyledAuthContactLink = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.font.size.lg};
`;
