import {
  StyledDrowdownWrapper,
  StyledNotifyIcon,
  StyledNotifyLink,
} from "@crema/components/AppNotifications/index.styled";
import IntlMessages from "@crema/helpers/IntlMessages";
import { Dropdown } from "antd";
import Link from "next/link";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";
import AppHeaderMessages from "../../AppHeaderMessages";
import AppLanguageSwitcher from "../../AppLanguageSwitcher";
import AppNotifications from "../../AppNotifications";
import AppLogo from "../components/AppLogo";
import { StyledDropdownWrapper } from "../index.styled";
import {
  StyledAppHeader,
  StyledAppHeaderSectionDesk,
  StyledAppHeaderSectionMobile,
  StyledHeaderSearch,
} from "./index.styled";
import { IoIosHelpCircleOutline } from "react-icons/io";

const items = [
  { key: 1, label: <AppHeaderMessages /> },
  { key: 2, label: <AppNotifications /> },
  { key: 3, label: <AppLanguageSwitcher /> },
];

const itemsHelp = [
  {
    key: 1,
    label: (
      <Link href={"/dashboards/faqs"} className="tt-expenses-space-center">
        <span className="ml-3">
          <IntlMessages id="common.contact.need" />
        </span>
      </Link>
    ),
  },
  {
    key: 2,
    label: (
      <Link
        href={"/dashboards/contact-us"}
        className="tt-expenses-space-center"
      >
        <span className="ml-3">
          <IntlMessages id="common.contact.us" />
        </span>
      </Link>
    ),
  },
];

type Props = {
  onToggleSidebar: (isCollapsed: boolean) => void;
  isCollapsed: boolean;
};
const AppHeader: React.FC<Props> = ({ isCollapsed, onToggleSidebar }) => {
  // States
  const { messages } = useIntl();

  // Render
  return (
    <StyledAppHeader>
      <a className="trigger" onClick={() => onToggleSidebar(!isCollapsed)}>
        <AiOutlineMenu />
      </a>
      <AppLogo />
      <StyledHeaderSearch
        placeholder={messages["common.searchHere"] as string}
      />
      <StyledAppHeaderSectionDesk>
        <StyledDrowdownWrapper>
          <Dropdown
            menu={{ items: itemsHelp }}
            className="dropdown"
            overlayClassName="header-notify-messages"
            overlayStyle={{ zIndex: 1052 }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <StyledNotifyLink onClick={(e) => e.preventDefault()}>
              <StyledNotifyIcon>
                <IoIosHelpCircleOutline />
              </StyledNotifyIcon>
            </StyledNotifyLink>
          </Dropdown>
        </StyledDrowdownWrapper>
        <AppLanguageSwitcher />
        <AppHeaderMessages />
        <AppNotifications />
      </StyledAppHeaderSectionDesk>
      <StyledAppHeaderSectionMobile>
        <StyledDropdownWrapper>
          <Dropdown
            menu={{ items }}
            overlayClassName="dropdown-wrapper"
            getPopupContainer={(triggerNode) => triggerNode}
            trigger={["click"]}
          >
            <a
              className="ant-dropdown-link-mobile"
              onClick={(e) => e.preventDefault()}
            >
              <FiMoreVertical />
            </a>
          </Dropdown>
        </StyledDropdownWrapper>
      </StyledAppHeaderSectionMobile>
    </StyledAppHeader>
  );
};

export default AppHeader;
