import NavLink from "next/link";
import React from "react";

import IntlMessages from "@crema/helpers/IntlMessages";
import { Tt_IconByName } from "utils";
import {
  StyledListItem,
  StyledListItemIcon,
  StyledListItemText,
} from "./index.styled";

type AppsSideBarFolderItemProps = {
  item: any;
  path: string;
};

const AppsSideBarFolderItem: React.FC<AppsSideBarFolderItemProps> = ({
  item,
  path,
}) => {
  return (
    <StyledListItem key={item.id}>
      <NavLink href={path}>
        <StyledListItemIcon>{Tt_IconByName[item.icon]}</StyledListItemIcon>
        <StyledListItemText>
          {
            <IntlMessages
              id={`common.icon.${item.name
                .replaceAll("-", ".")
                .toLocaleLowerCase()}`}
            />
          }
        </StyledListItemText>
      </NavLink>
    </StyledListItem>
  );
};

export default AppsSideBarFolderItem;
