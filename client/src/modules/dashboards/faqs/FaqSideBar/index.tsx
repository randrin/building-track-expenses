import IntlMessages from "@crema/helpers/IntlMessages";
import { FaqType } from "@crema/types/models/dashboards/FaqType";
import React, { ReactNode } from "react";
import { StyledFaqSidebarCard, StyledFaqSidebarList } from "../index.styled";
import SideBarItem from "./SideBarItem";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { Typography } from "antd";

export type FaqFolderData = {
  id: number;
  name: string | any;
  icon: ReactNode;
};

type FaqSideBarProps = {
  faqsData: FaqType[];
  onGetFaqData: (num: string) => void;
  selectionId: string;
};

const FaqSideBar: React.FC<FaqSideBarProps> = ({
  faqsData,
  onGetFaqData,
  selectionId,
}) => {
  const { Paragraph } = Typography;
  // Function
  const EmptyQuery = () => (
    <div className="text-center pt-30">
      <span className="tt-expenses-space-center">
        <TbMoodEmptyFilled size={50} />
      </span>
      <Paragraph>
        <IntlMessages id="faq.empty.queries" />
      </Paragraph>
    </div>
  );
  // Return
  return (
    <StyledFaqSidebarCard>
      <h3>
        <IntlMessages id="faq.queries" />
      </h3>
      <StyledFaqSidebarList aria-label="main mailbox folders">
        {!!faqsData?.length
          ? faqsData?.map((item) => {
              return (
                <SideBarItem
                  key={item._id}
                  item={item}
                  selectionId={selectionId}
                  onGetFaqData={onGetFaqData}
                />
              );
            })
          : EmptyQuery()}
      </StyledFaqSidebarList>
    </StyledFaqSidebarCard>
  );
};

export default FaqSideBar;
