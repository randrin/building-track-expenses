import IntlMessages from "@crema/helpers/IntlMessages";
import { RechargeType } from "@crema/types/models/dashboards/RechargeType";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { Tt_FormatDate, Tt_GetUser } from "utils";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import { StyledObjectTable } from "../../index.styled";
import RechargeActions from "./RechargeActions";

type Props = {
  rechargeData: RechargeType[];
  loading: boolean;
};

const RechargeTable = ({ rechargeData, loading }: Props) => {
  // Init
  const getColumns = (): ColumnsType<RechargeType> => [
    {
      title: <IntlMessages id="common.amount" />,
      dataIndex: "amount",
      key: "amount",
      render: (id, record) => (
        <span className="tt-expenses-primary">
          {record.amount} {record.currency}
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.employee" />,
      dataIndex: "employee",
      key: "employee",
      render: (id, record) => Tt_GetUser(record.employee),
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
      render: (text, record) => <RechargeActions recharge={record} />,
    },
  ];

  // Render
  return (
    <StyledObjectTable
      hoverColor
      data={rechargeData}
      loading={loading}
      columns={getColumns()}
      scroll={{ x: "auto" }}
    />
  );
};
export default RechargeTable;
