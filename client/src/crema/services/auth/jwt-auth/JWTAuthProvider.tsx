import { useInfoViewActionsContext } from "@crema/context/AppContextProvider/InfoViewContextProvider";
import { AuthUserType } from "@crema/types/models/AuthUser";
import { DepartmentType } from "@crema/types/models/dashboards/OrganizationType";
import { Modal, message, notification } from "antd";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import {
  UserStatusEnums,
  UsersProfileStepEnums,
} from "utils/common-constants.utils";
import {
  TAM_AUTHENTICATE_URL,
  TAM_DELETE_PROFILE_URL,
  TAM_DEPARTMENTS_USER_URL,
  TAM_LOGIN_URL,
  TAM_LOGOUT_URL,
  TAM_REGISTER_URL,
  TAM_SIGNIN_URL,
  TAM_UPDATE_PROFILE_URL,
  TAM_UPDATE_USER_DEPARTMENT_URL,
  TAM_USERS_URL,
} from "utils/end-points.utils";
import jwtAxios, { setAuthToken } from "./index";

interface JWTAuthContextProps {
  user: AuthUserType | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  departments: DepartmentType[];
  currentDepartment: DepartmentType;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

export type SignInProps = {
  email: string;
  password: string;
};

interface JWTAuthActionsProps {
  getAuthUser: () => void;
  clearAuthUser: () => void;
  signUpUser: (data: SignUpProps) => void;
  signInUser: (data: SignInProps) => void;
  logout: () => void;
  refreshUser: (data: string) => void;
  handleOnUpdateUserProfile: (
    data: object,
    userId: string,
    step: string
  ) => void;
  handleOnUserChangeDepartment: (data: object, userId: string) => void;
  handleOnDeleteUser: (userId: string) => void;
}

const JWTAuthContext = createContext<JWTAuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  departments: [],
  currentDepartment: null,
});
const JWTAuthActionsContext = createContext<JWTAuthActionsProps>({
  getAuthUser: () => {},
  clearAuthUser: () => {},
  signUpUser: () => {},
  signInUser: () => {},
  logout: () => {},
  refreshUser: (data: string) => {},
  handleOnUpdateUserProfile: (data: object, userId: string, step: string) => {},
  handleOnUserChangeDepartment: (data: object, userId: string) => {},
  handleOnDeleteUser: (userId: string) => {},
});

export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

interface JWTAuthAuthProviderProps {
  children: ReactNode;
}

const JWTAuthAuthProvider: React.FC<JWTAuthAuthProviderProps> = ({
  children,
}) => {
  // States
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [firebaseData, setJWTAuthData] = useState<JWTAuthContextProps>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    departments: [],
    currentDepartment: null,
  });
  const { messages } = useIntl();
  const router = useRouter();
  const infoViewActionsContext = useInfoViewActionsContext();

  // Destructing
  const confirm = Modal.confirm;

  // Init
  useEffect(() => {
    getAuthUser();
  }, []);

  // Functions
  const getAuthUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setJWTAuthData({
        user: undefined,
        isLoading: false,
        isAuthenticated: false,
        departments: [],
        currentDepartment: undefined,
      });
      return;
    }
    setAuthToken(token);

    jwtAxios
      .get(`${TAM_AUTHENTICATE_URL}/${token}`)
      .then(async ({ data }) => {
        if (data) {
          // Retrieve user departments
          const { data: dataDepartments } = await jwtAxios.get(
            `${TAM_DEPARTMENTS_USER_URL}/${data.user._id}`
          );
          console.log(dataDepartments);
          setUserOrganizations(dataDepartments.data);
          setJWTAuthData({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
            departments: dataDepartments.data,
            currentDepartment:
              dataDepartments.data.length === 1
                ? dataDepartments.data[0]
                : data.user.currentDepartment,
          });
        } else {
          localStorage.removeItem("token");
          setAuthToken();
          setJWTAuthData({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            departments: [],
            currentDepartment: null,
          });
        }
      })
      .catch((error) => {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
          departments: [],
          currentDepartment: undefined,
        });
        console.log("error: ", error);
        infoViewActionsContext.fetchError(error?.response?.data?.message);
      });
  };

  const signInUser = async ({ email, password }: SignInProps) => {
    infoViewActionsContext.fetchStart();
    try {
      const { data } = await jwtAxios.post(TAM_LOGIN_URL, { email, password });

      jwtAxios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

      // Retrieve user departments
      const { data: dataDepartments } = await jwtAxios.get(
        `${TAM_DEPARTMENTS_USER_URL}/${data.user._id}`
      );

      if (dataDepartments.data.length === 1) {
        await jwtAxios.put(
          `${TAM_UPDATE_USER_DEPARTMENT_URL}/${dataDepartments.data[0]._id}/profile/${data.user._id}`,
          {}
        );
      }

      setJWTAuthData({
        ...firebaseData,
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
        departments: dataDepartments.data,
        currentDepartment:
          dataDepartments.data.length === 1
            ? dataDepartments.data[0]
            : data.user.currentDepartment,
      });

      // Store the token in session only if the status is ACTIVE
      if (
        data.user.status === UserStatusEnums.ACTIVE &&
        !data.user.tmpPassword
      ) {
        setAuthToken(data.accessToken);
      }

      infoViewActionsContext.fetchSuccess();
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log("Error: ", error);
      infoViewActionsContext.fetchError(error?.response?.data?.message);
    }
  };

  const signUpUser = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    infoViewActionsContext.fetchStart();
    try {
      const { data } = await jwtAxios.post("users", { name, email, password });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      const res = await jwtAxios.get(TAM_REGISTER_URL);
      setJWTAuthData({
        user: res.data,
        isAuthenticated: true,
        isLoading: false,
        departments: userOrganizations,
        currentDepartment: null,
      });
      infoViewActionsContext.fetchSuccess();
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      infoViewActionsContext.fetchError("Something went wrong");
    }
  };

  const clearAuthUser = () => {
    setJWTAuthData({
      user: undefined,
      isAuthenticated: false,
      isLoading: false,
      departments: [],
      currentDepartment: undefined,
    });
  };

  const logout = async () => {
    infoViewActionsContext.fetchStart();
    try {
      const { data } = await jwtAxios.post(TAM_LOGOUT_URL);
      localStorage.removeItem("token");
      setAuthToken();
      setJWTAuthData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        departments: [],
        currentDepartment: null,
      });
      infoViewActionsContext.showMessage(data.message);
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log("Error: ", error);
      infoViewActionsContext.fetchError(error?.response?.data?.message);
    }
  };

  const refreshUser = async (userId: string) => {
    infoViewActionsContext.fetchStart();
    try {
      const { data } = await jwtAxios.get(`${TAM_USERS_URL}/${userId}`);
      console.log(data);
      setJWTAuthData({
        ...firebaseData,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log("Error: ", error);
      infoViewActionsContext.fetchError(error?.response?.data?.message);
    }
  };

  const handleOnUpdateUserProfile = async (
    userInfos: any,
    userId: string,
    step: string
  ) => {
    infoViewActionsContext.fetchStart();
    console.log(userInfos);

    const {
      addressLineOne,
      addressLineTwo,
      city,
      country,
      zipCode,
      phoneNumber,
      phonePrefix,
      bic,
      iban,
      beneficiary,
      currency,
      language,
      prefix,
      number,
    } = userInfos;
    let userData = {
      ...userInfos,
      infos: {
        addressLineOne,
        addressLineTwo,
        city,
        country,
        zipCode,
        phoneNumber,
        phonePrefix,
      },
      payment: {
        phone: {
          prefix,
          number,
        },
        bank: {
          bic,
          iban,
          beneficiary,
        },
      },
      setting: {
        currency,
        language,
      },
    };
    try {
      const { data } = await jwtAxios.put(
        `${TAM_UPDATE_PROFILE_URL}/${userId}/step=${step}`,
        userData
      );

      setJWTAuthData({
        ...firebaseData,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      if (step === UsersProfileStepEnums.RESET_PASSWORD) {
        notification.success({
          message: handleOnGetMessage("common.success"),
          description: handleOnGetMessage("message.profileUpdated"),
        });
        setJWTAuthData({
          departments: [],
          currentDepartment: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        router.push(TAM_SIGNIN_URL);
      } else {
        message.success(messages["message.profileUpdated"] as string);
      }
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log("Error: ", error);
      infoViewActionsContext.showMessage(error?.response?.data?.message);
      message.error(error?.response?.data?.message);
    }
  };

  const handleOnUserChangeDepartment = async (
    department: DepartmentType,
    userId: string
  ) => {
    console.log(department);
    infoViewActionsContext.fetchStart();
    try {
      await jwtAxios.put(
        `${TAM_UPDATE_USER_DEPARTMENT_URL}/${department._id}/profile/${userId}`,
        {}
      );
      getAuthUser();
      message.success(messages["message.departmentUpdated"] as string);
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
        currentDepartment: null,
      });
      console.log("Error: ", error);
      infoViewActionsContext.showMessage(error?.response?.data?.message);
    }
  };

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnDeleteUser = async (userId: string) => {
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
          .delete(`${TAM_DELETE_PROFILE_URL}/${userId}`)
          .then(({ data }) => {
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

  // Render
  return (
    <JWTAuthContext.Provider
      value={{
        ...firebaseData,
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          getAuthUser,
          clearAuthUser,
          signUpUser,
          signInUser,
          logout,
          refreshUser,
          handleOnUpdateUserProfile,
          handleOnUserChangeDepartment,
          handleOnDeleteUser,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};
export default JWTAuthAuthProvider;
