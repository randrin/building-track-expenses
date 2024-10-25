import { defaultTheme } from "@crema/constants/defaultConfig";
import IntlMessages from "@crema/helpers/IntlMessages";
import { UserType } from "@crema/types/models/dashboards/UserType";
import { Avatar, Tag, Tooltip } from "antd";
import { useOrganizationContext } from "modules/apps/context/OrganizationContextProvider";
import moment from "moment";
import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import {
  FORMAT_DATE_ONE,
  FORMAT_DATE_TWO,
  PREFIX_PASSWORD,
} from "utils/common-constants.utils";
import {
  Tt_FormatDate,
  Tt_GetStatusUser,
  Tt_GetUser,
} from "utils/common-functions.utils";
import { StyledUserTable } from "../index.styled";
import UserActions from "./UserActions";

type Props = {
  userData: UserType[];
  loading: boolean;
};

const UsersTable: React.FC<Props> = ({ userData, loading }: Props) => {

  // States
  const { organizations } = useOrganizationContext();
  const [showPassword, setShowwPassword] = useState(false);

  // Init
  const columns = [
    {
      title: <IntlMessages id="common.userId" />,
      dataIndex: "username",
      key: "username",
      render: (id, record) => (
        <Tag color={defaultTheme.theme.palette.primary.main}>
          {record.username}
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="common.user" />,
      dataIndex: "user",
      key: "user",
      render: (id, record) => Tt_GetUser(record),
    },
    {
      title: <IntlMessages id="common.salary" />,
      dataIndex: "salary",
      key: "salary",
      render: (id, record) => (
        <span>
          {record.salary ? Number(record.salary.amount).toLocaleString() : "-"}{" "}
          {record.salary?.currency}
        </span>
      ),
    },
    {
      title: <IntlMessages id="common.role" />,
      dataIndex: "role",
      key: "role",
      render: (id, record) => (
        <span className="tt-expenses-primary">
          {record.role ? (
            <IntlMessages id={`common.role.${record.role.toLowerCase()}`} />
          ) : (
            "-"
          )}
        </span>
      ),
    },
    // {
    //   title: <IntlMessages id="sidebar.app.dashboard.organizations" />,
    //   dataIndex: "organizations",
    //   key: "organizations",
    //   render: (id, record) => (
    //     <div className="tt-users-groups">
    //       {!!handleOnGetUserOrganizations(record)?.length ? (
    //         <Avatar.Group
    //           maxCount={4}
    //           maxStyle={{
    //             color: "#fff",
    //             backgroundColor: "#2997ff99",
    //             height: "40px",
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //             width: "40px",
    //           }}
    //         >
    //           {handleOnGetUserOrganizations(record)?.map((data, index) => (
    //             <>
    //               <Tooltip
    //                 placement="topLeft"
    //                 title={data.name}
    //                 className="tt-expenses-cursor-pointer"
    //               >
    //                 <Avatar
    //                   size={40}
    //                   key={"organization-" + index}
    //                   alt={data.name}
    //                   src={
    //                     data.logo?.secure_url
    //                       ? data.logo?.secure_url
    //                       : "/assets/icon/default-org.jpg"
    //                   }
    //                 />
    //               </Tooltip>
    //             </>
    //           ))}
    //         </Avatar.Group>
    //       ) : (
    //         "-"
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: <IntlMessages id="common.status" />,
      dataIndex: "status",
      key: "status",
      render: (text, record) => <span>{Tt_GetStatusUser(record.status)}</span>,
    },
    {
      title: <IntlMessages id="common.password" />,
      dataIndex: "tmpPassword",
      key: "tmpPassword",
      render: (text, record) => (
        <span className="d-flex">
          {record.tmpPassword ? (
            <span className="tt-expenses-space-center">
              <span className="mr-6">
                {showPassword ? getUserPassword(record) : "xxxxx"}
              </span>
              {showPassword ? (
                <GoEye
                  className="tt-expenses-primary"
                  onClick={() => setShowwPassword(!showPassword)}
                />
              ) : (
                <GoEyeClosed
                  className="tt-expenses-primary"
                  onClick={() => setShowwPassword(!showPassword)}
                />
              )}{" "}
            </span>
          ) : (
            "-"
          )}
        </span>
      ),
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
      title: <IntlMessages id="common.actions" />,
      dataIndex: "more",
      key: "more",
      fixed: "right",
      className: "order-table-action",
      render: (text, record) => <UserActions user={record} />,
    },
  ];

  // Functions
  const handleOnGetUserOrganizations = (user: UserType) => {
    return organizations?.filter((org) =>
      org.users.find((userOrg) => user._id === userOrg._id)
    );
  };

  const getUserPassword = (record: UserType) => {
    const currentDate = moment(record.createdAt).format("DD");
    const currentMonth = moment(record.createdAt).format("MM");
    const currentYear = moment(record.createdAt).format("YYYY");
    const defaultPassword = `${PREFIX_PASSWORD}${currentDate}${currentMonth}${currentYear}${"!"}`;
    return defaultPassword;
  };

  // Render
  return (
    <StyledUserTable
      hoverColor
      data={userData}
      loading={loading}
      columns={columns}
      pagination={false}
      scroll={{ x: "auto" }}
    />
  );
};

export default UsersTable;
