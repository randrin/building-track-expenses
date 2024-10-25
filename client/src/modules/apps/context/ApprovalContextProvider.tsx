import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { ReportType } from "@crema/types/models/dashboards/ReportType";
import { StatusExpenseEnums } from "utils/common-constants.utils";
import { message, notification } from "antd";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import {
  TAM_EXPENSE_APPROVATION_URL,
  TAM_REPORT_STATUS_QUERY_URL,
  TAM_REPORT_STATUS_URL,
} from "utils/end-points.utils";
import { useJWTAuth } from "@crema/services/auth/jwt-auth/JWTAuthProvider";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { useRouter } from "next/router";

export type ApprovalContextType = {
  approvalList: APIDataProps<ReportType[]>;
  approvals: ReportType[];
  loading: boolean;
  comment: string;
  isReject: boolean;
  isApproval: boolean;
  page: number;
};

const ContextState: ApprovalContextType = {
  approvalList: {} as APIDataProps<ReportType[]>,
  approvals: [],
  loading: false,
  comment: "",
  isReject: false,
  isApproval: false,
  page: 0,
};

export type ApprovalActionContextType = {
  reCallAPI: () => void;
  setComment: (data: string) => void;
  setIsReject: (data: boolean) => void;
  setIsApproval: (data: boolean) => void;
  handleOnApprovationExpense: (
    expenseId: string,
    status: string,
    comment: string
  ) => void;
  setPage: (data: number) => void;
  onPageChange: (data: number) => void;
};

const ApprovalContext = createContext<ApprovalContextType>(ContextState);
const ApprovalActionsContext = createContext<ApprovalActionContextType>({
  reCallAPI: () => {},
  setComment: (data: string) => {},
  setIsReject: (data: boolean) => {},
  setIsApproval: (data: boolean) => {},
  handleOnApprovationExpense: (
    expenseId: string,
    status: string,
    comment: string
  ) => {},
  setPage: (data: number) => {},
  onPageChange: (data: number) => {},
});

export const useApprovalContext = () => useContext(ApprovalContext);

export const useApprovalActionsContext = () =>
  useContext(ApprovalActionsContext);

type Props = {
  children: ReactNode;
};

export const ApprovalContextProvider = ({ children }: Props) => {
  // States
  const { user } = useJWTAuth();
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [comment, setComment] = useState("");
  const [isReject, setIsReject] = useState(false);
  const [isApproval, setIsApproval] = useState(false);
  const [page, setPage] = useState(0);
  const [{ apiData: approvalList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<ReportType[]>>(
      `${TAM_REPORT_STATUS_QUERY_URL}/${StatusExpenseEnums.UNDER_APPROVED}/userId/${user._id}`,
      undefined,
      { page: page },
      false
    );
  const [{ apiData }] = useGetDataApi<{
    data: ReportType[];
  }>(
    `${TAM_REPORT_STATUS_URL}/${StatusExpenseEnums.UNDER_APPROVED}/userId/${user._id}`
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

  const handleOnApprovationExpense = async (
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
    <ApprovalContext.Provider
      value={{
        approvalList,
        approvals: apiData?.data,
        loading,
        comment,
        isReject,
        isApproval,
        page,
      }}
    >
      <ApprovalActionsContext.Provider
        value={{
          reCallAPI,
          setComment,
          handleOnApprovationExpense,
          setPage,
          setIsReject,
          setIsApproval,
          onPageChange,
        }}
      >
        {children}
      </ApprovalActionsContext.Provider>
    </ApprovalContext.Provider>
  );
};

export default ApprovalContextProvider;
