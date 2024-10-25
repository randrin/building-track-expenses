import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { FaqType } from "@crema/types/models/dashboards/FaqType";
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
  TAM_FAQ_CREATE_URL,
  TAM_FAQ_DELETE_URL,
  TAM_FAQ_STATUS_URL,
  TAM_FAQ_UPDATE_URL,
  TAM_FAQS_QUERY_URL,
  TAM_FAQS_URL,
} from "utils/end-points.utils";

export type FaqContextType = {
  faqList: APIDataProps<FaqType[]>;
  faqs: FaqType[];
  loading: boolean;
  isAppModalOpen: boolean;
  faq: any;
  mode: string;
  page: number;
};

const ContextState: FaqContextType = {
  faqList: {} as APIDataProps<FaqType[]>,
  faqs: [],
  loading: false,
  isAppModalOpen: false,
  faq: {},
  mode: MODE_ADD,
  page: 0,
};

export type FaqActionContextType = {
  //setQueryParams: (data: object) => void;
  handleOnAddFaq: () => void;
  setFaq: (data: object) => void;
  handleOnSubmit: () => void;
  setAppModalOpen: (data: boolean) => void;
  handleOnGetFaq: (data: FaqType) => void;
  handleOnUpdate: (faqId: string, data: object) => void;
  handleOnDelete: (faqId: string) => void;
  handleOnEnabledOrDisabled: (faqId: string) => void;
  onPageChange: (data: number) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
};

const FaqContext = createContext<FaqContextType>(ContextState);
const FaqActionsContext = createContext<FaqActionContextType>({
  //setQueryParams: (data: object) => {},
  handleOnAddFaq: () => {},
  setFaq: (data: object) => {},
  handleOnSubmit: () => {},
  setAppModalOpen: (data: boolean) => {},
  handleOnGetFaq: (data: FaqType) => {},
  handleOnUpdate: (faqId: string, data: object) => {},
  handleOnDelete: (faqId: string) => {},
  handleOnEnabledOrDisabled: (faqId: string) => {},
  onPageChange: (data: number) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
});

export const useFaqContext = () => useContext(FaqContext);

export const useFaqActionsContext = () => useContext(FaqActionsContext);

type Props = {
  children: ReactNode;
};

export const FaqContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppModalOpen, setAppModalOpen] = useState(false);
  const [faq, setFaq] = useState({
    name: "",
  });
  const [{ apiData }] = useGetDataApi<{
    data: FaqType[];
  }>(TAM_FAQS_URL);
  const [{ apiData: faqList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<FaqType[]>>(
      `${TAM_FAQS_QUERY_URL}`,
      undefined,
      { page: page },
      false
    );

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

  const handleOnAddFaq = () => {
    setMode(MODE_ADD);
    setAppModalOpen(!isAppModalOpen);
    setFaq({ name: "" });
  };

  const handleOnSubmit = async () => {
    await jwtAxios
      .post(TAM_FAQ_CREATE_URL, faq)
      .then(({ data }) => {
        setFaq({ name: "" });
        reCallAPI();
        setAppModalOpen(!isAppModalOpen);
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

  const handleOnUpdate = async (faqId: string, faq: object) => {
    await jwtAxios
      .put(`${TAM_FAQ_UPDATE_URL}/${faqId}`, faq)
      .then(({ data }) => {
        reCallAPI();
        setAppModalOpen(!isAppModalOpen);
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

  const handleOnEnabledOrDisabled = async (faqId: string) => {
    await jwtAxios
      .put(`${TAM_FAQ_STATUS_URL}/${faqId}`)
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

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnDelete = async (faqId: string) => {
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
          .delete(`${TAM_FAQ_DELETE_URL}/${faqId}`)
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

  const handleOnGetFaq = (faq: FaqType) => {
    setMode(MODE_EDIT);
    setAppModalOpen(!isAppModalOpen);
    setFaq(faq);
  };

  // Render
  return (
    <FaqContext.Provider
      value={{
        faqList,
        faqs: apiData?.data,
        loading,
        isAppModalOpen,
        faq,
        mode,
        page,
      }}
    >
      <FaqActionsContext.Provider
        value={{
          handleOnAddFaq,
          setFaq,
          handleOnSubmit,
          setAppModalOpen,
          handleOnGetFaq,
          onPageChange,
          handleOnUpdate,
          handleOnDelete,
          handleOnEnabledOrDisabled,
          //setQueryParams,
          reCallAPI,
          setPage,
        }}
      >
        {children}
      </FaqActionsContext.Provider>
    </FaqContext.Provider>
  );
};

export default FaqContextProvider;
