import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { RechargeType } from "@crema/types/models/dashboards/RechargeType";
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
  TAM_RECHARGE_CREATE_URL,
  TAM_RECHARGE_DELETE_URL,
  TAM_RECHARGE_UPDATE_URL,
  TAM_RECHARGES_QUERY_URL,
  TAM_RECHARGES_URL,
} from "utils/end-points.utils";

export type RechargeContextType = {
  rechargeList: APIDataProps<RechargeType[]>;
  recharges: RechargeType[];
  loading: boolean;
  isAppDrawerOpen: boolean;
  recharge: any;
  mode: string;
  page: number;
};

const ContextState: RechargeContextType = {
  rechargeList: {} as APIDataProps<RechargeType[]>,
  recharges: [],
  loading: false,
  isAppDrawerOpen: false,
  recharge: {},
  mode: MODE_ADD,
  page: 0,
};

export type RechargeContexteActionType = {
  handleOnAddRecharge: () => void;
  setRecharge: (data: object) => void;
  handleOnSubmit: () => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnGetRecharge: (data: RechargeType) => void;
  handleOnUpdate: (rechargeId: string, data: object) => void;
  handleOnDelete: (rechargeId: string) => void;
  onPageChange: (data: number) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
};

const RechargeContext = createContext<RechargeContextType>(ContextState);
const RechargeActionsContext = createContext<RechargeContexteActionType>({
  handleOnAddRecharge: () => {},
  setRecharge: (data: object) => {},
  handleOnSubmit: () => {},
  setAppDrawerOpen: (data: boolean) => {},
  handleOnGetRecharge: (data: RechargeType) => {},
  handleOnUpdate: (rechargeId: string, data: object) => {},
  handleOnDelete: (rechargeId: string) => {},
  onPageChange: (data: number) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
});

export const useRechargeContext = () => useContext(RechargeContext);

export const useRechargeActionsContext = () =>
  useContext(RechargeActionsContext);
type Props = {
  children: ReactNode;
};

export const RechargeContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const [recharge, setRecharge] = useState({
    amount: 0,
    employee: "",
    currency: "",
  });
  const [{ apiData: rechargeList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<RechargeType[]>>(
      `${TAM_RECHARGES_QUERY_URL}`,
      undefined,
      { page: page },
      false
    );

  const [{ apiData }] = useGetDataApi<{
    data: RechargeType[];
  }>(TAM_RECHARGES_URL);

  // Destructing
  const confirm = Modal.confirm;

  // Init
  useEffect(() => {
    setPage(1);
  }, [asPath]);

  useEffect(() => {
    setQueryParams({
      page: page,
    });
  }, [page, asPath]);

  // Functions
  const onPageChange = (value: number) => {
    setPage(value);
  };

  const handleOnAddRecharge = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    resetRecharge();
  };

  const resetRecharge = () => {
    setRecharge({ amount: 0, employee: "", currency: "" });
  };

  const handleOnSubmit = async () => {
    console.log(recharge);
    
    await jwtAxios
      .post(TAM_RECHARGE_CREATE_URL, recharge)
      .then(({ data }) => {
        resetRecharge();
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
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  const handleOnUpdate = async (rechargeId: string, recharge: RechargeType) => {
    await jwtAxios
      .put(`${TAM_RECHARGE_UPDATE_URL}/${rechargeId}`, recharge)
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

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnDelete = async (rechargeId: string) => {
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
          .delete(`${TAM_RECHARGE_DELETE_URL}/${rechargeId}`)
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

  const handleOnGetRecharge = (recharge: RechargeType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setRecharge({
      amount: recharge.amount,
      employee: recharge.employee._id,
      currency: recharge.currency,
    });
  };

  // Render
  return (
    <RechargeContext.Provider
      value={{
        rechargeList,
        recharges: apiData?.data,
        loading,
        isAppDrawerOpen,
        recharge,
        mode,
        page,
      }}
    >
      <RechargeActionsContext.Provider
        value={{
          handleOnAddRecharge,
          setRecharge,
          handleOnSubmit,
          setAppDrawerOpen,
          handleOnGetRecharge,
          onPageChange,
          handleOnUpdate,
          handleOnDelete,
          reCallAPI,
          setPage,
        }}
      >
        {children}
      </RechargeActionsContext.Provider>
    </RechargeContext.Provider>
  );
};
export default RechargeContextProvider;
