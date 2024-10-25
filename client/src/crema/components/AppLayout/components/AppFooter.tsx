import React from "react";
import { useLayoutContext } from "@crema/context/AppContextProvider/LayoutContextProvider";
import {
  StyledFooterBtnView,
  StyledMainFooter,
  StyledFooterBtn,
} from "./AppFooter.styled";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const createdYear = 2024;
  const { footer } = useLayoutContext();

  if (footer) {
    return (
      <StyledMainFooter>
        <p>
          Copyright@{" "}
          {currentYear == createdYear
            ? createdYear
            : createdYear + "-" + currentYear}
        </p>
        <StyledFooterBtnView>
          <StyledFooterBtn type="link" color="primary">
            Tam Tam Expenses
          </StyledFooterBtn>
        </StyledFooterBtnView>
      </StyledMainFooter>
    );
  }
  return null;
};

export default AppFooter;
