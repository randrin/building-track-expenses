import AppCard from "@crema/components/AppCard";
import { ContactType } from "@crema/types/models/dashboards/ContactType";
import { Avatar } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { useIntl } from "react-intl";
import {
  StyledContactTable,
  StyledContactUserInfo,
  StyledContactUserInfoContent,
} from "../index.styled";
import { StyledContactListItemAvatar } from "modules/dashboards/contacts/ContactListing/index.styled";
import IntlMessages from "@crema/helpers/IntlMessages";
import moment from "moment";
import { Tt_FormatDate, Tt_GetUser } from "utils";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";

interface Props {
  data: ContactType[];
}

const WidgetLatestContacts = ({ data }: Props) => {
  // States
  const { messages } = useIntl();

  // Init
  const columns: ColumnsType<ContactType> = [
    {
      title: <IntlMessages id="common.fullname" />,
      dataIndex: "displayName",
      key: "displayName",
      render: (name, record) => (
        <StyledContactUserInfo>
          {record.photoURL ? (
            <Avatar size={36} src={record.photoURL.secure_url} />
          ) : (
            <StyledContactListItemAvatar size={36}>
              {record.displayName[0].toUpperCase()}
            </StyledContactListItemAvatar>
          )}
          <StyledContactUserInfoContent>
            <h3>{record.displayName}</h3>
          </StyledContactUserInfoContent>
        </StyledContactUserInfo>
      ),
    },
    {
      title: <IntlMessages id="common.email" />,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <IntlMessages id="common.phone" />,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: <IntlMessages id="common.createdAt" />,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (id, record) => (
        <span>
          {Tt_FormatDate(moment(record.createdAt).format(FORMAT_DATE_ONE))}{" "}
          <br />
          <i>{moment(record.createdAt).format(FORMAT_DATE_TWO)}</i>
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.createdBy" />,
      dataIndex: "createdBy",
      key: "createdBy",
      render: (id, record) => Tt_GetUser(record.createdBy),
    },
  ];

  // Render
  return (
    <AppCard
      className="no-card-space-ltr-rtl"
      title={messages["common.latest.contacts"] as string}
      extra={
        <a href={`/dashboards/contacts`}>
          {messages["common.viewAll"] as string}
        </a>
      }
    >
      <StyledContactTable
        scroll={{ x: "auto", y: 340 }}
        hoverColor
        data={data}
        columns={columns}
      />
    </AppCard>
  );
};

export default WidgetLatestContacts;
