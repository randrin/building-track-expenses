import React, { ReactNode } from "react";
import { Button, Progress } from "antd";
import IntlMessages from "@crema/helpers/IntlMessages";
import {
  StyledEmptyListContainer,
  StyledEmptyListContainerFlex,
} from "./index.styled";
import { PlusOutlined } from "@ant-design/icons";

type ListEmptyResultProps = {
  title?: string | ReactNode;
  actionTitle?: string | ReactNode;
  onClick?: () => void;
  loading?: boolean;
  loader?: boolean;
  placeholder?: ReactNode;
  content?: string;
};

export const ListEmptyResult: React.FC<ListEmptyResultProps> = ({
  loader,
  placeholder,
  loading,
  title = <IntlMessages id="common.noRecordFound" />,
  actionTitle,
  content,
  onClick,
}) => {
  if (loading || loader) {
    return (
      <React.Fragment>
        {placeholder ? (
          placeholder
        ) : (
          <StyledEmptyListContainerFlex>
            <Progress percent={30} />
            <span>Loading...</span>
          </StyledEmptyListContainerFlex>
        )}
      </React.Fragment>
    );
  } else {
    return (
      <StyledEmptyListContainer>
        {title ? <h4>{title}</h4> : null}
        <p>{content}</p>

        {actionTitle ? (
          <Button
            type="primary"
            size="large"
            style={{ marginTop: 0, minWidth: 150 }}
            onClick={onClick}
          >
            <PlusOutlined /> {actionTitle}
          </Button>
        ) : null}
      </StyledEmptyListContainer>
    );
  }
};

export default ListEmptyResult;
