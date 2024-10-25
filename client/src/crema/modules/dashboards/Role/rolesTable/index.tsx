import IntlMessages from "@crema/helpers/IntlMessages";
import { PermissionType } from "@crema/types/models/dashboards/PermissionType";
import { RoleType } from "@crema/types/models/dashboards/RoleType";
import { Button, Col, Input, Modal, Row } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import { Tt_FormatDate, Tt_GetUser } from "utils/common-functions.utils";
import { StyledObjectTable } from "../../index.styled";
import RoleActions from "./RoleActions";
import { useIntl } from "react-intl";

type Props = {
  roleData: RoleType[];
  loading: boolean;
};

const RoleTable = ({ roleData, loading }: Props) => {
  // States
  const { messages } = useIntl();
  const [isOpenView, setIsOpenView] = useState(false);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [filterData, setFilterData] = useState("");

  // Init
  const getColumns = (): ColumnsType<RoleType> => [
    {
      title: <IntlMessages id="common.role" />,
      dataIndex: "title",
      key: "title",
      render: (id, record) => (
        <span className="tt-expenses-primary">{record.title}</span>
      ),
    },
    {
      title: <IntlMessages id="common.description" />,
      dataIndex: "description",
      key: "description",
    },
    {
      title: <IntlMessages id="sidebar.app.dashboard.permissions" />,
      dataIndex: "permissions",
      key: "permissions",
      render: (id, record) => (
        <span
          className="tt-expenses-primary"
          onClick={() => handleOnViewPermissions(record.permissions)}
        >
          {record.permissions?.length || 0}
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
      title: <IntlMessages id="common.actions" />,
      dataIndex: "actions",
      key: "actions",
      className: "order-table-action",
      fixed: "right",
      render: (text, record) => <RoleActions role={record} />,
    },
  ];

  // Functions
  const handleOnViewPermissions = (permissions: PermissionType[]) => {
    setPermissions(permissions);
    setIsOpenView(!isOpenView);
  };

  const onGetFilteredItems = () => {
    if (filterData === "") {
      return permissions;
    } else {
      return permissions?.filter(
        (permission: PermissionType) =>
          permission.code
            .toLocaleLowerCase()
            .includes(filterData.toLocaleLowerCase()) ||
          permission.description
            .toLocaleLowerCase()
            .includes(filterData.toLocaleLowerCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <StyledObjectTable
        hoverColor
        data={roleData}
        loading={loading}
        columns={getColumns()}
        scroll={{ x: "auto" }}
      />
      {/* View Permissions */}
      <Modal
        centered
        title={<IntlMessages id="dashboard.permissions.view" />}
        open={isOpenView}
        onCancel={() => setIsOpenView(!isOpenView)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsOpenView(!isOpenView)}
            className="tt-expenses-space-center"
          >
            <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.back" />
          </Button>,
        ]}
      >
        <Row>
          <Col>
            <Input
              id="permission-name"
              size="large"
              placeholder={messages["common.searchHere"] as string}
              type="search"
              onChange={(event) => setFilterData(event.target.value)}
            />
          </Col>
        </Row>
        <Row>
          {list.map((permission) => (
            <Col xs={24} lg={24} key={permission._id}>
              <div className="tt-expenses-space-start">
                <i className="tt-expenses-primary mr-3">{permission.code}</i>-
                <span className="ml-3">{permission.description}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
};

export default RoleTable;
