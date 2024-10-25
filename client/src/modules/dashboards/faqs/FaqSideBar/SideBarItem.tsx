import { FaqType } from "@crema/types/models/dashboards/FaqType";
import clsx from "clsx";
import { useSubFaqContext } from "modules/apps/context/SubFaqContextProvider";
import React from "react";
import { StyledFaqSidebarListItem } from "../index.styled";

type SideBarItemProps = {
  item: FaqType;
  onGetFaqData: (num: string) => void;
  selectionId: string;
};

const SideBarItem: React.FC<SideBarItemProps> = ({
  item,
  onGetFaqData,
  selectionId,
}) => {
  // States
  const { subFaqs } = useSubFaqContext();

  // Render
  return (
    <StyledFaqSidebarListItem
      style={{ display: "flex" }}
      className={clsx({
        active: item._id === selectionId,
      })}
      onClick={() => onGetFaqData(item._id)}
    >
      <p className="mr-10">{item.name}</p>
      {"("}
      <span>
        {subFaqs.filter((subFaq) => subFaq.faq._id === item._id).length}
      </span>
      {")"}
    </StyledFaqSidebarListItem>
  );
};

export default SideBarItem;
