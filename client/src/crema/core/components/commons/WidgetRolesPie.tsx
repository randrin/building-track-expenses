import AppCard from "@crema/components/AppCard";
import { Fonts } from "@crema/constants/AppEnums";
import IntlMessages from "@crema/helpers/IntlMessages";
import { RoleType } from "@crema/types/models/dashboards/RoleType";
import { List } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { UsersRolesEnums } from "utils/common-constants.utils";
import { StyledListItem, StyledUserGraphWrapper } from "../index.styled";
import { UserType } from "@crema/types/models/dashboards/UserType";
import { Tt_GetBackgroundColorStatusUser, Tt_GetColorStatusUser } from "utils/common-functions.utils";

type DataUserProps = {
  name: string;
  value: number;
  color: string;
};

interface Props {
  roles: RoleType[];
  users: UserType[];
}

const WidgetRolesPie = ({ roles, users }: Props) => {
  // States
  const [usersData, setUsersData] = useState<DataUserProps[]>([]);

  // Desctructing
  const { messages } = useIntl();

  // Init
  useEffect(() => {
    const dataPies: DataUserProps[] = [];
    Object.values(UsersRolesEnums).map((role) => {
      const dataPie: DataUserProps = {
        name: messages[`common.role.${role?.toLocaleLowerCase()}`] as string,
        value: users.filter((user) => user.role === role).length,
        color: Tt_GetColorStatusUser(role),
      };
      dataPies.push(dataPie);
    });
    setUsersData(dataPies);
  }, []);

  // Render
  return (
    <AppCard
      title={messages["dashboard.role.total"] as string}
      extra={
        <Link href={"/dashboards/privileges/roles"}>
          {messages["common.viewAll"] as string}
        </Link>
      }
    >
      <StyledUserGraphWrapper>
        <div className="user-item user-graph-item">
          <ResponsiveContainer height={250}>
            <PieChart>
              <text
                x="50%"
                fontWeight={Fonts.MEDIUM}
                fontSize={20}
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {roles.length}
              </text>
              <text
                x="50%"
                fontWeight={Fonts.MEDIUM}
                fontSize={20}
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {messages["sidebar.app.dashboard.roles"] as string}
              </text>
              <Pie
                data={usersData}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="95%"
              >
                {Object.values(UsersRolesEnums).map((role, index) => (
                  <Cell key={index} fill={Tt_GetColorStatusUser(role)} />
                ))}
              </Pie>
              <Tooltip
                labelStyle={{ color: "black" }}
                contentStyle={{
                  borderRadius: 12,
                  borderColor: "#31354188",
                  background: "#FFFFFFCA",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="user-item">
          <List>
            {Object.values(UsersRolesEnums).map((role, index) => {
              return (
                <StyledListItem key={index}>
                  <div className="user-wrapper">
                    <div
                      style={{ backgroundColor: "red" }}
                      className={`dot-icon ${Tt_GetBackgroundColorStatusUser(role)}`}
                    />
                    <div className="user-text">
                      <IntlMessages
                        id={`common.role.${role?.toLocaleLowerCase()}`}
                      />
                    </div>
                  </div>
                </StyledListItem>
              );
            })}
          </List>
        </div>
      </StyledUserGraphWrapper>
    </AppCard>
  );
};
export default WidgetRolesPie;
