import IntlMessages from "@crema/helpers/IntlMessages";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { Tt_FormatDate, Tt_GetUser } from "utils";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import { Tt_GetObjectStatus } from "utils/common-functions.utils";
import { StyledObjectTable } from "../../index.styled";
import CategoryActions from "./CategoryActions";

type Props = {
  categoryData: CategoryType[];
  loading: boolean;
  type: string;
};

const CategoryTable = ({ categoryData, loading, type }: Props) => {
  // Init
  const getColumns = (): ColumnsType<CategoryType> => [
    {
      title: <IntlMessages id="common.title" />,
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
      render: (text, record) => (
        <CategoryActions category={record} type={type} />
      ),
    },
  ];

  // Render
  return (
    <StyledObjectTable
      hoverColor
      data={categoryData}
      loading={loading}
      columns={getColumns()}
      scroll={{ x: "auto" }}
    />
  );
};

export default CategoryTable;
