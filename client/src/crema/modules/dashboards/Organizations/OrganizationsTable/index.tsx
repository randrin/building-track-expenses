import IntlMessages from "@crema/helpers/IntlMessages";
import { OrganizationType } from "@crema/types/models/dashboards/OrganizationType";
import { Avatar, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { NextRouter, useRouter } from "next/router";
import { FORMAT_DATE_ONE, FORMAT_DATE_TWO } from "utils/common-constants.utils";
import {
  Tt_FormatDate,
  Tt_GetObjectStatus,
  Tt_GetUserAvatar,
} from "utils/common-functions.utils";
import {
  StyledFlex,
  StyledObjectTable,
  StyledText,
  StyledUserInfoAvatar,
} from "../../index.styled";
import OrganizationActions from "./OrganizationActions";

const getColumns = (router: NextRouter): ColumnsType<OrganizationType> => [
  {
    title: <IntlMessages id="common.logo" />,
    dataIndex: "logo",
    key: "logo",
    render: (id, record) => (
      <span
        className="tt-expenses-cursor-pointer tt-expenses-space-center"
        onClick={() =>
          router.push(`/dashboards/organisations/detail/${record._id}`)
        }
      >
        <Avatar
          style={{
            marginRight: 14,
            width: 44,
            height: 44,
          }}
          src={
            record.logo?.secure_url
              ? record.logo?.secure_url
              : "/assets/icon/default-org.jpg"
          }
        />
        <div
          style={{
            flex: 1,
          }}
        >
          <Typography.Title
            level={5}
            className="tt-expenses-primary"
            style={{ fontSize: 14, marginBottom: 0 }}
          >
            {record.name}
          </Typography.Title>
          <StyledText>{record.code}</StyledText>
        </div>
      </span>
    ),
  },
  {
    title: <IntlMessages id="common.departments" />,
    dataIndex: "users",
    key: "users",
    render: (id, record) => (
      <div
        onClick={() =>
          router.push(`/dashboards/organisations/detail/${record._id}`)
        }
        className="tt-users-groups"
      >
        {!!record.departments.length ? (
          <Avatar.Group
            maxCount={4}
            maxStyle={{
              color: "#fff",
              backgroundColor: "#2997ff99",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
            }}
          >
            {record.departments.map((data, index) => (
              <>
                <Tooltip
                  placement="topLeft"
                  title={data.name}
                  className="tt-expenses-cursor-pointer"
                >
                  <Avatar
                    size={40}
                    key={"department-" + index}
                    alt={"department-" + index}
                    src={
                      data.logo?.secure_url
                        ? data.logo?.secure_url
                        : "/assets/icon/default-org.jpg"
                    }
                  />
                </Tooltip>
              </>
            ))}
          </Avatar.Group>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <IntlMessages id="common.createdBy" />,
    dataIndex: "createdBy",
    key: "createdBy",
    render: (id, record) => (
      <StyledFlex>
        {record.createdBy ? (
          <>
            {record.createdBy?.photoURL ? (
              <Avatar
                style={{
                  width: 44,
                  height: 44,
                }}
                src={record.createdBy?.photoURL.secure_url}
              />
            ) : (
              <StyledUserInfoAvatar photoRGA={record.createdBy?.photoRGA}>
                {Tt_GetUserAvatar(record.createdBy)}
              </StyledUserInfoAvatar>
            )}
            <div
              style={{
                flex: 1,
              }}
            >
              <Typography.Title
                level={5}
                style={{ fontSize: 14, marginBottom: 0 }}
              >
                {record.createdBy?.displayName}
              </Typography.Title>
              <StyledText>{record.createdBy?.email}</StyledText>
            </div>
          </>
        ) : (
          "-"
        )}
      </StyledFlex>
    ),
  },
  {
    title: <IntlMessages id="common.createdAt" />,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (id, record) => (
      <>
        {record.updatedAt ? (
          <span>
            {Tt_FormatDate(moment(record.createdAt).format(FORMAT_DATE_ONE))}{" "}
            <br />
            <i>{moment(record.createdAt).format(FORMAT_DATE_TWO)}</i>
          </span>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    title: <IntlMessages id="common.updatedAt" />,
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (id, record) => (
      <>
        {record.updatedAt ? (
          <span>
            {Tt_FormatDate(moment(record.updatedAt).format(FORMAT_DATE_ONE))}{" "}
            <br />
            <i>{moment(record.updatedAt).format(FORMAT_DATE_TWO)}</i>
          </span>
        ) : (
          "-"
        )}
      </>
    ),
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
    render: (text, record) => <OrganizationActions organization={record} />,
  },
  // {
  //   title: <IntlMessages id="common.actions" />,
  //   dataIndex: "actions7",
  //   key: "actions7",
  //   render: (text, record) => (
  //     <span
  //       className="tt-expenses-cursor-pointer tt-expenses-space-center"
  //       onClick={() =>
  //         router.push(`/dashboards/organisations/detail/${record._id}`)
  //       }
  //     >
  //       <BsArrowRightSquareFill className="tt-expenses-icon-small tt-expenses-secondary" />
  //     </span>
  //   ),
  // },
];

type Props = {
  organizationData: OrganizationType[];
  loading: boolean;
};

const OrganizationTable = ({ organizationData, loading }: Props) => {
  // States
  const router = useRouter();

  // Functions

  // Render
  return (
    <StyledObjectTable
      hoverColor
      data={organizationData}
      loading={loading}
      columns={getColumns(router)}
      scroll={{ x: "auto" }}
    />
  );
};

export default OrganizationTable;
