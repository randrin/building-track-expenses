import AppAnimateGroup from "@crema/components/AppAnimateGroup";
import AppInfoView from "@crema/components/AppInfoView";
import AppLogo from "@crema/components/AppLayout/components/AppLogo";
import IntlMessages from "@crema/helpers/IntlMessages";
import Router from "next/router";
import PropTypes from "prop-types";
import React from "react";
import { TAM_CONTACT_US_URL } from "utils/end-points.utils";
import {
  StyledAuth,
  StyledAuthCard,
  StyledAuthCardHeader,
  StyledAuthContactLink,
  StyledAuthLink,
  StyledAuthMainContent,
  StyledAuthWelContent,
  StyledAuthWellAction,
  StyledAuthWrap,
  StyledMainAuthScrollbar
} from "./AuthWrapper.styled";
import WithFooter from "./withFooter";

type Props = {
  children: React.ReactNode;
};
const AuthWrapper = ({ children }: Props) => {
  // States

  // Init

  // Render
  return (
    <StyledAuth className="tt-expenses-ant-layout">
      <StyledMainAuthScrollbar>
        <AppAnimateGroup
          type="scale"
          animateStyle={{ flex: 1 }}
          style={{ flex: 1 }}
          delay={0}
          interval={10}
          duration={200}
        >
          <StyledAuthWrap key={"wrap"}>
            {/* <StyledAuthCard> */}
              <StyledAuthMainContent>
                {/* <StyledAuthCardHeader>
                  <AppLogo />
                </StyledAuthCardHeader> */}
                {children}
              </StyledAuthMainContent>
              {/* <StyledAuthWellAction>
                <StyledAuthWelContent>
                  <h2>
                    <IntlMessages id="welcome.app.title" />
                  </h2>
                  <p>
                    <IntlMessages id="welcome.app.description" />
                  </p>
                </StyledAuthWelContent>
              </StyledAuthWellAction> */}
            {/* </StyledAuthCard> */}
            <StyledAuthContactLink className="tt-expenses-space-center">
              <span>
                <IntlMessages id="common.contact.need" />
              </span>
              <StyledAuthLink onClick={() => Router.push(TAM_CONTACT_US_URL)}>
                <IntlMessages id="common.contact.us" />
              </StyledAuthLink>
            </StyledAuthContactLink>
            <WithFooter />
          </StyledAuthWrap>
          <AppInfoView />
        </AppAnimateGroup>
      </StyledMainAuthScrollbar>
    </StyledAuth>
  );
};

export default AuthWrapper;

AuthWrapper.propTypes = {
  children: PropTypes.node,
};
