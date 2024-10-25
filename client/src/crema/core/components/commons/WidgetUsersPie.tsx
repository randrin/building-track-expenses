import AppCard from "@crema/components/AppCard";
import { List } from "antd";
import { StyledListItem, StyledUserGraphWrapper } from "../index.styled";
import { useIntl } from "react-intl";
import { UserType } from "@crema/types/models/dashboards/UserType";
import IntlMessages from "@crema/helpers/IntlMessages";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Fonts } from "@crema/constants/AppEnums";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserStatusEnums } from "utils/common-constants.utils";
import {
  Tt_GetBackgroundColorStatus,
  Tt_GetColorStatus,
} from "utils/common-functions.utils";

type DataProps = {
  data: UserType[];
};

type DataUserProps = {
  name: string;
  value: number;
  color: string;
};

const WidgetUsersPie: React.FC<DataProps> = ({ data }) => {
  // States
  const [usersData, setUsersData] = useState<DataUserProps[]>([]);

  // Desctructing
  const { messages } = useIntl();

  // Init
  useEffect(() => {
    const dataPies: DataUserProps[] = [];
    Object.values(UserStatusEnums).map((status) => {
      const dataPie: DataUserProps = {
        name: messages[
          `common.status.${status.replaceAll("_", ".").toLocaleLowerCase()}`
        ] as string,
        value: data.filter((user) => user.status === status).length,
        color: Tt_GetColorStatus(status),
      };
      dataPies.push(dataPie);
    });
    setUsersData(dataPies);
  }, []);

  // Render
  return (
    <AppCard
      title={messages["dashboard.user.total"] as string}
      extra={
        <Link href={"/dashboards/users"}>
          {messages["common.viewAll"] as string}
        </Link>
      }
    >
      <StyledUserGraphWrapper>
        <div className="user-item user-graph-item">
          <ResponsiveContainer height={300}>
            <PieChart>
              <text
                x="50%"
                fontWeight={Fonts.MEDIUM}
                fontSize={20}
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {data.length}
              </text>
              <text
                x="50%"
                fontWeight={Fonts.MEDIUM}
                fontSize={20}
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {messages["common.users"] as string}
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
                {Object.values(UserStatusEnums).map((status, index) => (
                  <Cell key={index} fill={Tt_GetColorStatus(status)} />
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
            {Object.values(UserStatusEnums).map((status, index) => {
              return (
                <StyledListItem key={index}>
                  <div className="user-wrapper">
                    <div
                      style={{ backgroundColor: "red" }}
                      className={`dot-icon ${Tt_GetBackgroundColorStatus(
                        status
                      )}`}
                    />
                    <div className="user-text">
                      <IntlMessages
                        id={`common.status.${status
                          .replaceAll("_", ".")
                          .toLocaleLowerCase()}`}
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
export default WidgetUsersPie;
