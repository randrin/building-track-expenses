import { defaultTheme } from "@crema/constants/defaultConfig";
import Editor from "@crema/core/components/editor/Editor";
import IntlMessages from "@crema/helpers/IntlMessages";
import { SubFaqType } from "@crema/types/models/dashboards/SubFaqType";
import { Button, Modal, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useState } from "react";
import { GoEye } from "react-icons/go";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useIntl } from "react-intl";
import { Tt_FormatDate, Tt_GetUser } from "utils";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import { Tt_GetObjectStatus } from "utils/common-functions.utils";
import { StyledObjectTable } from "../../index.styled";
import SubFaqActions from "./SubFaqActions";

type Props = {
  subFaqData: SubFaqType[];
  loading: boolean;
};

const SubFaqTable = ({ subFaqData, loading }: Props) => {
  // States
  const { messages } = useIntl();
  const [description, setDescription] = useState("");
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  // Init
  const getColumns = (): ColumnsType<SubFaqType> => [
    {
      title: <IntlMessages id="common.title" />,
      dataIndex: "title",
      key: "title",
      render: (id, record) => (
        <span className="tt-expenses-primary">{record.title}</span>
      ),
    },
    {
      title: <IntlMessages id="common.faq" />,
      dataIndex: "faq",
      key: "faq",
      render: (id, record) => (
        <Tag color={defaultTheme.theme.palette.primary.main}>
          {record.faq.name}
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="common.description" />,
      dataIndex: "description",
      key: "description",
      render: (id, record) => (
        <span className="d-flex">
          <span className="tt-expenses-space-center">
            <GoEye
              className="tt-expenses-primary"
              onClick={() => handleOnViewSubFab(record)}
            />
          </span>
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.createdAt" />,
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (id, record) => (
        <span>
          {Tt_FormatDate(moment(record.updatedAt).format(FORMAT_DATE_ONE))}{" "}
          <br />
          <i>{moment(record.updatedAt).format(FORMAT_DATE_TWO)}</i>
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.createdBy" />,
      dataIndex: "createdBy",
      key: "createdBy",
      render: (id, record) => Tt_GetUser(record.createdBy),
    },
    {
      title: <IntlMessages id="common.status" />,
      dataIndex: "status",
      key: "status",
      render: (data, record) => Tt_GetObjectStatus(record.status),
    },
    {
      title: <IntlMessages id="common.actions" />,
      dataIndex: "actions",
      key: "actions",
      className: "order-table-action",
      fixed: "right",
      render: (text, record) => <SubFaqActions subFaq={record} />,
    },
  ];

  // Functions
  const handleOnViewSubFab = (subFaq: SubFaqType) => {
    setIsAppModalOpen(!isAppModalOpen);
    setDescription(subFaq.description);
  };

  // Render
  return (
    <>
      <StyledObjectTable
        hoverColor
        data={subFaqData}
        loading={loading}
        columns={getColumns()}
        scroll={{ x: "auto" }}
      />
      <Modal
        centered
        title={<IntlMessages id="dashboard.subfaq.view" />}
        open={isAppModalOpen}
        width={950}
        onCancel={() => setIsAppModalOpen(!isAppModalOpen)}
        footer={
          <Space>
            <Button
              className="tt-expenses-space-center"
              onClick={() => setIsAppModalOpen(!isAppModalOpen)}
            >
              <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
              {messages["common.back"] as string}
            </Button>
          </Space>
        }
      >
        <Editor value={description} readOnly={true} />
      </Modal>
    </>
  );
};

export default SubFaqTable;
