import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { ContactMessageType } from "@crema/types/models/dashboards/ContactType";
import { CountryFilterType } from "@crema/types/models/dashboards/CountryFilterType";
import { CountryType } from "@crema/types/models/dashboards/CountryType";
import { RoleType } from "@crema/types/models/dashboards/RoleType";
import { message, notification } from "antd";
import { ReactNode, createContext, useContext, useState } from "react";
import {
  TAM_COUNTRIES_FILTER_URL,
  TAM_COUNTRIES_URL,
  TAM_ROLES_URL,
  TAM_UTILS_CONTACT_MESSAGE_URL,
  TAM_UTILS_CREATE_CONTACT_MESSAGE_URL
} from "utils/end-points.utils";

export type UtilContextType = {
  contactMessages: ContactMessageType[];
  countries: CountryType[];
  countriesFilter: CountryFilterType[];
  roles: RoleType[];
};

const ContextState: UtilContextType = {
  contactMessages: [],
  countries: [],
  countriesFilter: [],
  roles: [],
};

export type UtilActionsContextType = {
  handleOnSubmitContactMessage: (data: ContactMessageType) => void;
};

const UtilContext = createContext<UtilContextType>(ContextState);
const UtilActionsContext = createContext<UtilActionsContextType>({
  handleOnSubmitContactMessage: (data: ContactMessageType) => {},
});

export const useUtilContext = () => useContext(UtilContext);

export const useUtilActionsContext = () => useContext(UtilActionsContext);

type Props = {
  children: ReactNode;
};

export const UtilContextProvider = ({ children }: Props) => {
  // States
  //const { messages } = useIntl();
  const [contactMessage, setContactMessage] = useState({
    displayName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [{ apiData: contactMessages }] = useGetDataApi<{
    data: ContactMessageType[];
  }>(TAM_UTILS_CONTACT_MESSAGE_URL);

  const [{ apiData: countries }] = useGetDataApi<{
    data: CountryType[];
  }>(TAM_COUNTRIES_URL);

  const [{ apiData: countriesFilter }] = useGetDataApi<{
    data: CountryType[];
  }>(TAM_COUNTRIES_FILTER_URL);

  const [{ apiData: roles }] = useGetDataApi<{
    data: RoleType[];
  }>(TAM_ROLES_URL);

  // Functions
  const handleOnGetMessage = (message: string) => {
    return "" //messages[message] as string;
  };

  const handleOnSubmitContactMessage = async (
    contactMessage: ContactMessageType
  ) => {
    await jwtAxios
      .post(TAM_UTILS_CREATE_CONTACT_MESSAGE_URL, contactMessage)
      .then(({ data }) => {
        resetContactMessage();
        // TODO: create a custom component notification
        notification.success({
          message: handleOnGetMessage("common.success"),
          description: handleOnGetMessage(
            "common.notification.add.description"
          ),
        });
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message
        );
      });
  };

  const resetContactMessage = () => {
    setContactMessage({
      displayName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  // Render
  return (
    <UtilContext.Provider
      value={{
        contactMessages: contactMessages?.data,
        countries: countries?.data,
        countriesFilter: countriesFilter?.data,
        roles: roles?.data,
      }}
    >
      <UtilActionsContext.Provider value={{ handleOnSubmitContactMessage }}>
        {children}
      </UtilActionsContext.Provider>
    </UtilContext.Provider>
  );
};
