import { defaultTheme } from "@crema/constants/defaultConfig";
import IntlMessages from "@crema/helpers/IntlMessages";
import { TicketType } from "@crema/types/models/dashboards/TicketType";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useRouter } from "next/router";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { Tt_FormatDate, Tt_GetTicketStatus, Tt_GetUser } from "utils";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import { StyledObjectTable } from "../index.styled";

type Props = {
  ticketData: TicketType[];
  loading: boolean;
};

const TicketTable = ({ ticketData, loading }: Props) => {
  // States
  const router = useRouter();

  // Init
  const getColumns = (): ColumnsType<TicketType> => [
    {
      title: <IntlMessages id="common.ticket" />,
      dataIndex: "code",
      key: "code",
      render: (id, record) => <span>#{record.code}</span>,
    },
    {
      title: <IntlMessages id="common.object" />,
      dataIndex: "object",
      key: "object",
    },
    {
      title: <IntlMessages id="common.subject" />,
      dataIndex: "description",
      key: "description",
      render: (id, record) => (
        <Tag color={defaultTheme.theme.palette.primary.main}>
          {record.subject.title}
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="common.employee" />,
      dataIndex: "employee",
      key: "employee",
      render: (id, record) => Tt_GetUser(record.createdBy),
    },
    {
      title: <IntlMessages id="common.createdAt" />,
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (id, record) => (
        <span>
          {Tt_FormatDate(moment(record.createdAt).format(FORMAT_DATE_ONE))}{" "}
          <br />
          <i>{moment(record.createdAt).format(FORMAT_DATE_TWO)}</i>
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.status" />,
      dataIndex: "status",
      key: "status",
      render: (data, record) => Tt_GetTicketStatus(record.status),
    },
    {
      title: <IntlMessages id="common.actions" />,
      dataIndex: "actions",
      key: "actions",
      className: "order-table-action",
      fixed: "right",
      render: (text, record) => (
        <span
          className="tt-expenses-cursor-pointer tt-expenses-space-center"
          onClick={() =>
            router.push(`/dashboards/help-center/ticket_detail/${record._id}`)
          }
        >
          <BsArrowRightSquareFill className="tt-expenses-icon-small tt-expenses-secondary" />
        </span>
      ),
    },
  ];

  // Render
  return (
    <StyledObjectTable
      hoverColor
      data={ticketData}
      loading={loading}
      columns={getColumns()}
      scroll={{ x: "auto" }}
    />
  );
};

export default TicketTable;
