import { useGetDataApi } from "@crema/hooks/APIHooks";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { StatusExpenseEnums } from "utils/common-constants.utils";
import {
  TAM_EXPENSE_APPROVATION_URL,
  TAM_REPORT_STATUS_QUERY_URL,
  TAM_REPORT_STATUS_URL,
} from "utils/end-points.utils";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { useIntl } from "react-intl";
import { message, notification } from "antd";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { useRouter } from "next/router";

export type AccountingContextType = {
  accountingList: APIDataProps<ReportType[]>;
  accountings: ReportType[];
  loading: boolean;
  comment: string;
  isReject: boolean;
  isApproval: boolean;
  page: number;
};

const ContextState: AccountingContextType = {
  accountingList: {} as APIDataProps<ReportType[]>,
  accountings: [],
  loading: false,
  comment: "",
  isApproval: false,
  isReject: false,
  page: 0,
};

export type AccountingActionContextType = {
  reCallAPI: () => void;
  setComment: (data: string) => void;
  setIsReject: (data: boolean) => void;
  setIsApproval: (data: boolean) => void;
  handleOnAccountingExpense: (
    expenseId: string,
    status: string,
    comment: string
  ) => void;
  setPage: (data: number) => void;
  onPageChange: (data: number) => void;
};

const AccountingContext = createContext<AccountingContextType>(ContextState);
const AccountingActionsContext = createContext<AccountingActionContextType>({
  reCallAPI: () => {},
  setComment: (data: string) => {},
  setIsReject: (data: boolean) => {},
  setIsApproval: (data: boolean) => {},
  handleOnAccountingExpense: (
    expenseId: string,
    status: string,
    comment: string
  ) => {},
  setPage: (data: number) => {},
  onPageChange: (data: number) => {},
});

export const useAccountingContext = () => useContext(AccountingContext);

export const useAccountingActionsContext = () =>
  useContext(AccountingActionsContext);

type Props = {
  children: ReactNode;
};

export const AccountingContextProvider = ({ children }: Props) => {
  // States
  const { user } = useJWTAuth();
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [page, setPage] = useState(0);
  const [comment, setComment] = useState("");
  const [isReject, setIsReject] = useState(false);
  const [isApproval, setIsApproval] = useState(false);
  const [{ apiData: accountingList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<ReportType[]>>(
      `${TAM_REPORT_STATUS_QUERY_URL}/${StatusExpenseEnums.ACCOUNTING}/userId/${user._id}`,
      undefined,
      { page: page },
      false
    );
  const [{ apiData }] = useGetDataApi<{
    data: ReportType[];
  }>(
    `${TAM_REPORT_STATUS_URL}/${StatusExpenseEnums.ACCOUNTING}/userId/${user._id}`
  );

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

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnAccountingExpense = async (
    expenseId: string,
    status: string,
    comment: string
  ) => {
    await jwtAxios
      .put(`${TAM_EXPENSE_APPROVATION_URL}=${status}/expenseId=${expenseId}`, {
        comment,
      })
      .then(({ data }) => {
        reCallAPI();
        // TODO: create a custom component notification
        notification.success({
          message: handleOnGetMessage("common.success"),
          description: handleOnGetMessage(
            "common.notification.update.description"
          ),
        });
        setIsReject(false);
        setIsApproval(false);
        setComment("");
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
    <AccountingContext.Provider
      value={{
        accountingList,
        accountings: apiData?.data,
        loading,
        comment,
        isReject,
        isApproval,
        page,
      }}
    >
      <AccountingActionsContext.Provider
        value={{
          reCallAPI,
          setComment,
          handleOnAccountingExpense,
          setPage,
          setIsReject,
          setIsApproval,
          onPageChange,
        }}
      >
        {children}
      </AccountingActionsContext.Provider>
    </AccountingContext.Provider>
  );
};

export default AccountingContextProvider;
