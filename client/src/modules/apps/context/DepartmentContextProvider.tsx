import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { DepartmentType } from "@crema/types/models/dashboards/OrganizationType";
import { message, Modal, notification } from "antd";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { MODE_ADD, MODE_EDIT } from "utils/common-constants.utils";
import {
  TAM_DEPARMENT_ADD_USERS_URL,
  TAM_DEPARMENT_CREATE_URL,
  TAM_DEPARMENT_DELETE_URL,
  TAM_DEPARMENT_STATUS_URL,
  TAM_DEPARMENT_UPDATE_URL,
  TAM_DEPARMENTS_QUERY_URL,
  TAM_DEPARMENTS_URL,
  TAM_ORGANIZATIONS_URL,
} from "utils/end-points.utils";

export type DepartmentContextType = {
  departmentList: APIDataProps<DepartmentType[]>;
  departments: DepartmentType[];
  isAppDrawerOpen: boolean;
  loading: boolean;
  department: any;
  organization: any;
  mode: string;
  page: number;
};

const ContextState: DepartmentContextType = {
  departmentList: {} as APIDataProps<DepartmentType[]>,
  departments: [],
  isAppDrawerOpen: false,
  loading: false,
  department: {},
  organization: {},
  mode: MODE_ADD,
  page: 0,
};

export type DepartmentActionsType = {
  setAppDrawerOpen: (data: boolean) => void;
  handleOnSubmitDepartment: () => void;
  handleOnGetDepartment: (data: object) => void;
  handleOnGetDepartmentById: (departmentId: string) => void;
  onPageChange: (data: number) => void;
  handleOnUpdate: (departmentId: string, data: object) => void;
  handleOnAddUsersToDepartment: (departmentId: string, data: object) => void;
  setDepartment: (data: object) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
  setMode: (data: string) => void;
  handleOnEnabledOrDisabled: (departmentId: string) => void;
  handleOnDelete: (organizationId: string, departmentId: string) => void;
  handleOnGetOrganization: (organizationId: string) => void;
};

const DepartmentActionsContext = createContext<DepartmentActionsType>({
  setAppDrawerOpen: (data: boolean) => {},
  handleOnSubmitDepartment: () => {},
  handleOnGetDepartment: (data: DepartmentType) => {},
  handleOnGetDepartmentById: (departmentId: string) => {},
  onPageChange: (data: number) => {},
  handleOnUpdate: (departmentId: string, data: object) => {},
  handleOnAddUsersToDepartment: (departmentId: string, data: object) => {},
  setDepartment: (data: object) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
  setMode: (data: string) => {},
  handleOnEnabledOrDisabled: (departmentId: string) => {},
  handleOnDelete: (organizationId: string, departmentId: string) => {},
  handleOnGetOrganization: (organizationId: string) => {},
});

const DepartmentContext = createContext<DepartmentContextType>(ContextState);

export const useDepartmentContext = () => useContext(DepartmentContext);

export const useDepartmentActionsContext = () =>
  useContext(DepartmentActionsContext);

type Props = {
  children: ReactNode;
};

export const DepartmentContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath, query } = router;
  const { all } = query;
  const { messages } = useIntl();
  const [department, setDepartment] = useState({
    organizationId: "",
    name: "",
    description: "",
    manager: "",
    logo: {},
    contributors: [],
  });
  const [organization, setOrganization] = useState({
    name: "",
    description: "",
    headOffice: "",
    departments: [],
    phoneNumber: "",
    phonePrefix: "",
    logo: {},
  });
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);

  const [{ apiData: departmentList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<DepartmentType[]>>(
      `${TAM_DEPARMENTS_QUERY_URL}`,
      undefined,
      { page: page },
      false
    );

  const [{ apiData }] = useGetDataApi<{
    data: DepartmentType[];
  }>(`${TAM_DEPARMENTS_URL}`);

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

  const resetDepartment = () => {
    setDepartment({
      organizationId: "",
      name: "",
      description: "",
      manager: "",
      logo: {},
      contributors: [],
    });
  };

  const handleOnSubmitDepartment = async () => {
    await jwtAxios
      .post(TAM_DEPARMENT_CREATE_URL, department)
      .then(({ data }) => {
        handleOnGetOrganization(department.organizationId);
        resetDepartment();
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

  const handleOnGetOrganization = async (organizationId: string) => {
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

  const handleOnGetDepartment = (department: DepartmentType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setDepartment({
      organizationId: "",
      name: department.name,
      description: department.description,
      manager: department.manager._id,
      logo: department.logo,
      contributors: department.contributors,
    });
  };

  const handleOnDelete = async (
    organizationId: string,
    departmentId: string
  ) => {
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
          .delete(
            `${TAM_DEPARMENT_DELETE_URL}/${departmentId}/organization/${organizationId}`
          )
          .then(({ data }) => {
            handleOnGetOrganization(department.organizationId);
            resetDepartment();
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

  const handleOnEnabledOrDisabled = async (departmentId: string) => {
    await jwtAxios
      .put(`${TAM_DEPARMENT_STATUS_URL}/${departmentId}`)
      .then(({ data }) => {
        handleOnGetOrganization(all[0]);
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

  const handleOnAddUsersToDepartment = async (
    departmentId: string,
    users: string[]
  ) => {
    await jwtAxios
      .put(`${TAM_DEPARMENT_ADD_USERS_URL}/${departmentId}`, users)
      .then(({ data }) => {
        handleOnGetOrganization(department.organizationId);
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

  const handleOnUpdate = async (departmentId: string, dept: object) => {
    await jwtAxios
      .put(`${TAM_DEPARMENT_UPDATE_URL}/${departmentId}`, dept)
      .then(({ data }) => {
        handleOnGetOrganization(department.organizationId);
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

  const handleOnGetDepartmentById = async (departmentId: string) => {
    await jwtAxios
      .get(`${TAM_DEPARMENTS_URL}/${departmentId}`)
      .then(({ data }) => {
        setDepartment({
          organizationId: department.organizationId,
          manager: data.department.manager._id,
          ...data.department,
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
    <DepartmentContext.Provider
      value={{
        departmentList,
        departments: apiData?.data,
        isAppDrawerOpen,
        loading,
        department,
        mode,
        page,
        organization,
      }}
    >
      <DepartmentActionsContext.Provider
        value={{
          setAppDrawerOpen,
          handleOnGetDepartment,
          handleOnGetDepartmentById,
          onPageChange,
          handleOnUpdate,
          handleOnAddUsersToDepartment,
          reCallAPI,
          setPage,
          setDepartment,
          handleOnSubmitDepartment,
          handleOnEnabledOrDisabled,
          handleOnDelete,
          handleOnGetOrganization,
          setMode,
        }}
      >
        {children}
      </DepartmentActionsContext.Provider>
    </DepartmentContext.Provider>
  );
};

export default DepartmentContextProvider;
