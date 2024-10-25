import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import {
  FilterUserType,
  UserType,
} from "@crema/types/models/dashboards/UserType";
import { Modal, message, notification } from "antd";
import { MODE_ADD, MODE_EDIT, StatusEnums } from "utils/common-constants.utils";
import {
  TAM_DEPARMENTS_BY_ORGANIZATION_URL,
  TAM_USERS_QUERY_URL,
  TAM_USERS_URL,
  TAM_USER_ADD_DEPARTMENTS_URL,
  TAM_USER_CREATE_URL,
  TAM_USER_DELETE_URL,
  TAM_USER_FILTER_URL,
  TAM_USER_STATUS_URL,
  TAM_USER_UPDATE_URL,
} from "utils/end-points.utils";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useOrganizationContext } from "./OrganizationContextProvider";
import { useIntl } from "react-intl";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { useRouter } from "next/router";
import { DepartmentType } from "@crema/types/models/dashboards/OrganizationType";

export type UserContextType = {
  userList: APIDataProps<UserType[]>;
  users: UserType[];
  departments: DepartmentType[];
  loading: boolean;
  isAppDrawerOpen: boolean;
  mode: string;
  user: any;
  page: number;
};

const ContextState: UserContextType = {
  userList: {} as APIDataProps<UserType[]>,
  users: [],
  departments: [],
  loading: false,
  isAppDrawerOpen: false,
  mode: MODE_ADD,
  user: {},
  page: 0,
};

export type UserActionsContextType = {
  handleOnAddUser: () => void;
  handleOnSubmitUser: () => void;
  setUser: (data: object) => void;
  handleOnGetUser: (data: UserType) => void;
  handleOnUpdateUser: (userId: string, data: UserType) => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnAddDepartmentsToUser: (userId: string, data: object) => void;
  handleOnUpdateUserStatus: (userId: string, data: string) => void;
  handleOnDelete: (data: UserType) => void;
  onPageChange: (data: number) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
  handleOnGetDepartmentsByOrganization: (data: string) => void;
  handleOnFilterUser: (data: FilterUserType) => void;
};

const UserContext = createContext<UserContextType>(ContextState);
const UserActionsContext = createContext<UserActionsContextType>({
  handleOnAddUser: () => {},
  handleOnSubmitUser: () => {},
  setUser: (data: object) => {},
  handleOnGetUser: (data: UserType) => {},
  handleOnUpdateUser: (userId: string, data: UserType) => {},
  setAppDrawerOpen: (data: boolean) => {},
  handleOnAddDepartmentsToUser: (userId: string, data: object) => {},
  handleOnUpdateUserStatus: (userId: string, data: string) => {},
  handleOnDelete: (data: UserType) => {},
  onPageChange: (data: number) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
  handleOnGetDepartmentsByOrganization: (data: string) => {},
  handleOnFilterUser: (data: FilterUserType) => {},
});

export const useUserContext = () => useContext(UserContext);

export const useUserActionsContext = () => useContext(UserActionsContext);

type Props = {
  children: ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath, query } = router;
  const { messages } = useIntl();
  const { organizations } = useOrganizationContext();
  const [user, setUser] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    email: "",
    salary: { amount: "", currency: "" },
    role: "",
    dateOfBorn: new Date(),
    contact: {
      phonePrefix: "",
      phoneNumber: null,
    },
    organization: "",
    department: "",
  });
  const [mode, setMode] = useState(MODE_ADD);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);

  const [
    { apiData: userList, loading },
    { setQueryParams, reCallAPI, setData, setLoading },
  ] = useGetDataApi<APIDataProps<UserType[]>>(
    `${TAM_USERS_QUERY_URL}`,
    undefined,
    { page: page },
    false
  );

  const [{ apiData }] = useGetDataApi<{
    data: UserType[];
  }>(TAM_USERS_URL);

  // Destructing
  const confirm = Modal.confirm;

  // Init
  useEffect(() => {
    setPage(1);
  }, [asPath]);

  useEffect(() => {
    setQueryParams({
      page: page,
      filter: query,
    });
  }, [page, asPath]);

  // Functions
  const handleOnFilterUser = async (filter: FilterUserType) => {
    console.log(filter);
    await jwtAxios
      .put(`${TAM_USER_FILTER_URL}`, filter)
      .then(({ data }) => {
        console.log(data);
        setLoading(true);
        setTimeout(() => {
          setData(data);
          setLoading(false);
        }, 500);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(error.response.data.message[0]);
      });
  };

  const handleOnGetDepartmentsByOrganization = async (
    organizationsId: string
  ) => {
    setUser({ ...user, organization: organizationsId, department: "" });
    await jwtAxios
      .get(`${TAM_DEPARMENTS_BY_ORGANIZATION_URL}/${organizationsId}`)
      .then(({ data }) => {
        setDepartments(data.data.departments);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(error.response.data.message[0]);
      });
  };

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnSubmitUser = async () => {
    await jwtAxios
      .post(TAM_USER_CREATE_URL, user)
      .then(({ data }) => {
        resetUser();
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

  const onPageChange = (value: number) => {
    setPage(value);
  };

  const handleOnAddUser = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    resetUser();
  };

  const resetUser = () => {
    setUser({
      gender: "",
      firstName: "",
      lastName: "",
      email: "",
      salary: { amount: "", currency: "" },
      role: "",
      dateOfBorn: new Date(),
      contact: {
        phonePrefix: "",
        phoneNumber: null,
      },
      organization: "",
      department: "",
    });
  };

  const handleOnGetUser = (user: any | UserType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setUser({
      ...user,
    });
  };

  const handleOnUpdateUser = async (userId: string, user: UserType) => {
    await jwtAxios
      .put(`${TAM_USER_UPDATE_URL}/${userId}`, user)
      .then(({ data }) => {
        setAppDrawerOpen(!isAppDrawerOpen);
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

  const handleOnAddDepartmentsToUser = async (
    userId: string,
    groups: string[]
  ) => {
    await jwtAxios
      .put(`${TAM_USER_ADD_DEPARTMENTS_URL}/${userId}`, groups)
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

  const handleOnUpdateUserStatus = async (userId: string, status: string) => {
    await jwtAxios
      .put(`${TAM_USER_STATUS_URL}/${status}/${userId}`, {})
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

  const handleOnDelete = async (user: UserType) => {
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
          .delete(`${TAM_USER_DELETE_URL}/${user._id}`)
          .then(({ data }) => {
            reCallAPI();
            // TODO: create a custom component notification
            notification.success({
              message: handleOnGetMessage("common.success"),
              description: handleOnGetMessage(
                "common.notification.archive.description"
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

  // Render
  return (
    <UserContext.Provider
      value={{
        userList,
        users: apiData?.data,
        departments,
        loading,
        isAppDrawerOpen,
        mode,
        user,
        page,
      }}
    >
      <UserActionsContext.Provider
        value={{
          handleOnAddUser,
          handleOnSubmitUser,
          setUser,
          handleOnGetUser,
          handleOnUpdateUser,
          handleOnUpdateUserStatus,
          handleOnDelete,
          handleOnAddDepartmentsToUser,
          setAppDrawerOpen,
          onPageChange,
          reCallAPI,
          setPage,
          handleOnGetDepartmentsByOrganization,
          handleOnFilterUser,
        }}
      >
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
};

export default UserContextProvider;
