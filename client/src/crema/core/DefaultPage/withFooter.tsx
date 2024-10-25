import React from "react";
import {
  StyledAuthFooter,
  StyledAuthFooterContent,
} from "./AuthWrapper.styled";
import AppLanguageSwitcher from "@crema/components/AppLanguageSwitcher";
import IntlMessages from "@crema/helpers/IntlMessages";
import Link from "next/link";

const WithFooter = () => {
  // States
  const currentYear = new Date().getFullYear();
  const createdYear = 2024;

  // Render
  return (
    <StyledAuthFooter>
      <span className="tt-expenses-space-center">
        <AppLanguageSwitcher />
      </span>
      <StyledAuthFooterContent>
        @{""}
        {currentYear == createdYear
          ? createdYear
          : createdYear + "-" + currentYear}{" "}
        <IntlMessages id="footer.copyright" />
        <Link className="tt-expenses-secondary" href={"/terms-and-conditions"}>
          <IntlMessages id="footer.terms" />
        </Link>{" "}
        <IntlMessages id="common.and" />
        <Link className="tt-expenses-secondary" href={"/privacy"}>
          <IntlMessages id="footer.privacy" />
        </Link>
      </StyledAuthFooterContent>
    </StyledAuthFooter>
  );
};

export default WithFooter;
