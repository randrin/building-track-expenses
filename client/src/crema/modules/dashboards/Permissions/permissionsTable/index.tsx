import IntlMessages from "@crema/helpers/IntlMessages";
import { PermissionType } from "@crema/types/models/dashboards/PermissionType";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import {
  FORMAT_DATE_ONE,
  FORMAT_DATE_TWO
} from "utils/common-constants.utils";
import {
  Tt_FormatDate,
  Tt_GetObjectStatus,
  Tt_GetUser
} from "utils/common-functions.utils";
import {
  StyledObjectTable
} from "../../index.styled";
import PermissionActions from "./PermissionActions";

type Props = {
  permissionData: PermissionType[];
  loading: boolean;
};

const PermissionTable = ({ permissionData, loading }: Props) => {
  // Init
  const getColumns = (): ColumnsType<PermissionType> => [
    {
      title: <IntlMessages id="common.code" />,
      dataIndex: "code",
      key: "code",
      render: (id, record) => (
        <span className="tt-expenses-primary">{record.code}</span>
      ),
    },
    {
      title: <IntlMessages id="common.description" />,
      dataIndex: "description",
      key: "description",
    },
    {
      title: <IntlMessages id="common.status" />,
      dataIndex: "status",
      key: "status",
      render: (data, record) => Tt_GetObjectStatus(record.status),
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
      render: (text, record) => <PermissionActions permission={record} />,
    },
  ];

  // Render
  return (
    <StyledObjectTable
      hoverColor
      data={permissionData}
      loading={loading}
      columns={getColumns()}
      scroll={{ x: "auto" }}
    />
  );
};

export default PermissionTable;
