import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { OrganizationType } from "@crema/types/models/dashboards/OrganizationType";
import { Modal, message, notification } from "antd";
import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { MODE_ADD, MODE_EDIT } from "utils/common-constants.utils";
import {
  TAM_ORGANIZATIONS_QUERY_URL,
  TAM_ORGANIZATIONS_URL,
  TAM_ORGANIZATION_ADD_USERS_URL,
  TAM_ORGANIZATION_CREATE_URL,
  TAM_ORGANIZATION_DELETE_URL,
  TAM_ORGANIZATION_STATUS_URL,
  TAM_ORGANIZATION_UPDATE_URL,
} from "utils/end-points.utils";

export type OrganizationContextType = {
  organizationList: APIDataProps<OrganizationType[]>;
  organizations: OrganizationType[];
  isAppDrawerOpen: boolean;
  loading: boolean;
  organization: any;
  mode: string;
};

const ContextState: OrganizationContextType = {
  organizationList: {} as APIDataProps<OrganizationType[]>,
  organizations: [],
  isAppDrawerOpen: false,
  loading: false,
  organization: {},
  mode: MODE_ADD,
};

export type OrganizationActionContextType = {
  handleOnAddOrganization: () => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnSubmitOrganization: () => void;
  handleOnGetOrganization: (data: OrganizationType) => void;
  handleOnGetOrganizationById: (organizationId: string) => void;
  onPageChange: (data: number) => void;
  handleOnUpdate: (organizationId: string, data: object) => void;
  handleOnAddUsersToOrganization: (
    organizationId: string,
    data: object
  ) => void;
  setOrganization: (data: object) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
  handleOnEnabledOrDisabled: (organizationId: string) => void;
  handleOnDelete: (organizationId: string) => void;
};

const OrganizationContext =
  createContext<OrganizationContextType>(ContextState);
const OrganizationActionsContext = createContext<OrganizationActionContextType>(
  {
    handleOnAddOrganization: () => {},
    setAppDrawerOpen: (data: boolean) => {},
    handleOnSubmitOrganization: () => {},
    handleOnGetOrganization: (data: OrganizationType) => {},
    handleOnGetOrganizationById: (organizationId: string) => {},
    onPageChange: (data: number) => {},
    handleOnUpdate: (organizationId: string, data: object) => {},
    handleOnAddUsersToOrganization: (
      organizationId: string,
      data: object
    ) => {},
    setOrganization: (data: object) => {},
    reCallAPI: () => {},
    setPage: (data: number) => {},
    handleOnEnabledOrDisabled: (organizationId: string) => {},
    handleOnDelete: (organizationId: string) => {},
  }
);

export const useOrganizationContext = () => useContext(OrganizationContext);

export const useOrganizationActionsContext = () =>
  useContext(OrganizationActionsContext);

type Props = {
  children: ReactNode;
};

export const OrganizationContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [organization, setOrganization] = useState({
    name: "",
    description: "",
    headOffice: "",
    phoneNumber: "",
    phonePrefix: "",
    logo: {},
  });
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);

  const [
    { apiData: organizationList, loading },
    { setQueryParams, reCallAPI },
  ] = useGetDataApi<APIDataProps<OrganizationType[]>>(
    `${TAM_ORGANIZATIONS_QUERY_URL}`,
    undefined,
    { page: page },
    false
  );

  const [{ apiData }] = useGetDataApi<{
    data: OrganizationType[];
  }>(`${TAM_ORGANIZATIONS_URL}`);

  // Init
  useEffect(() => {
    setPage(1);
  }, [asPath]);

  useEffect(() => {
    setQueryParams({
      page: page,
    });
  }, [page, asPath]);

  // Destruction
  const confirm = Modal.confirm;

  // Functions
  const onPageChange = (value: number) => {
    setPage(value);
  };

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnAddOrganization = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    resetOrganization();
  };

  const resetOrganization = () => {
    setOrganization({
      name: "",
      description: "",
      headOffice: "",
      phoneNumber: "",
      phonePrefix: "",
      logo: {},
    });
  };

  const handleOnSubmitOrganization = async () => {
    await jwtAxios
      .post(TAM_ORGANIZATION_CREATE_URL, organization)
      .then(({ data }) => {
        resetOrganization();
        reCallAPI();
        setAppDrawerOpen(!isAppDrawerOpen);
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

  const handleOnUpdate = async (
    organizationId: string,
    organization: object
  ) => {
    await jwtAxios
      .put(`${TAM_ORGANIZATION_UPDATE_URL}/${organizationId}`, organization)
      .then(({ data }) => {
        reCallAPI();
        setAppDrawerOpen(!isAppDrawerOpen);
        // TODO: create a custom component notification
        notification.success({
          message: handleOnGetMessage("common.success"),
          description: handleOnGetMessage(
            "common.notification.update.description"
          ),
        });
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  const handleOnGetOrganizationById = async (organizationId: string) => {
    await jwtAxios
      .get(`${TAM_ORGANIZATIONS_URL}/${organizationId}`)
      .then(({ data }) => {
        setOrganization({
          ...data.organization,
        });
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  const handleOnEnabledOrDisabled = async (organizationId: string) => {
    await jwtAxios
      .put(`${TAM_ORGANIZATION_STATUS_URL}/${organizationId}`)
      .then(({ data }) => {
        reCallAPI();
        // TODO: create a custom component notification
        notification.success({
          message: handleOnGetMessage("common.success"),
          description: handleOnGetMessage(
            "common.notification.update.description"
          ),
        });
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  const handleOnDelete = async (organizationId: string) => {
    confirm({
      title: handleOnGetMessage("common.modal.confirm.delete.title"),
      content: handleOnGetMessage("common.modal.confirm.delete.content"),
      okText: handleOnGetMessage("common.yes"),
      okType: "primary",
      cancelButtonProps: {
        style: { background: "#d12420", color: "white", border: "none" },
      },
      cancelText: handleOnGetMessage("common.no"),
      async onOk() {
        await jwtAxios
          .delete(`${TAM_ORGANIZATION_DELETE_URL}/${organizationId}`)
          .then(({ data }) => {
            reCallAPI();
            // TODO: create a custom component notification
            notification.success({
              message: handleOnGetMessage("common.success"),
              description: handleOnGetMessage(
                "common.notification.delete.description"
              ),
            });
          })
          .catch((error: any) => {
            console.log("Error: ", error);
            message.error(
              error.response.data.message || error.response.data.message[0]
            );
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleOnGetOrganization = (organization: OrganizationType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setOrganization(organization);
  };

  const handleOnAddUsersToOrganization = async (
    organizationId: string,
    users: string[]
  ) => {
    await jwtAxios
      .put(`${TAM_ORGANIZATION_ADD_USERS_URL}/${organizationId}`, users)
      .then(({ data }) => {
        reCallAPI();
        // TODO: create a custom component notification
        notification.success({
          message: handleOnGetMessage("common.success"),
          description: handleOnGetMessage(
            "common.notification.update.description"
          ),
        });
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  // Render
  return (
    <OrganizationContext.Provider
      value={{
        organizationList,
        organizations: apiData?.data,
        isAppDrawerOpen,
        loading,
        organization,
        mode,
      }}
    >
      <OrganizationActionsContext.Provider
        value={{
          handleOnAddOrganization,
          setAppDrawerOpen,
          handleOnGetOrganization,
          handleOnGetOrganizationById,
          onPageChange,
          handleOnUpdate,
          handleOnAddUsersToOrganization,
          reCallAPI,
          setPage,
          setOrganization,
          handleOnSubmitOrganization,
          handleOnEnabledOrDisabled,
          handleOnDelete,
        }}
      >
        {children}
      </OrganizationActionsContext.Provider>
    </OrganizationContext.Provider>
  );
};

export default OrganizationContextProvider;
