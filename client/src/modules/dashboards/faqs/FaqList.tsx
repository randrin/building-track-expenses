import { SubFaqType } from "@crema/types/models/dashboards/SubFaqType";
import { Collapse, theme } from "antd";
import React from "react";
import { StyledFaqList } from "./index.styled";
import Editor from "@crema/core/components/editor/Editor";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import IntlMessages from "@crema/helpers/IntlMessages";

const { Panel } = Collapse;

function callback(key: any) {
  console.log(key);
}

type FaqListProps = {
  faqList: SubFaqType[];
};

const FaqList: React.FC<FaqListProps> = ({ faqList }) => {
  // States
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 15,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  // Render
  return (
    <StyledFaqList>
      {faqList?.length ? (
        <Collapse
          collapsible="header"
          accordion
          bordered={false}
          expandIcon={({ isActive }) =>
            isActive ? (
              <AiOutlineMinusCircle size={20} />
            ) : (
              <AiOutlinePlusCircle size={20} />
            )
          }
          expandIconPosition="end"
          defaultActiveKey={faqList[0]?._id}
          onChange={callback}
        >
          {faqList.map((item) => {
            return (
              <Panel header={item.title} key={item._id} style={panelStyle}>
                <Editor readOnly={true} value={item.description} />
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <IntlMessages id="subfaq.empty" />
      )}
    </StyledFaqList>
  );
};

export default FaqList;
