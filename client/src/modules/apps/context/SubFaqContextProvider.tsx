import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { FaqType } from "@crema/types/models/dashboards/FaqType";
import { SubFaqType } from "@crema/types/models/dashboards/SubFaqType";
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
  TAM_FAQS_URL,
  TAM_SUB_FAQ_CREATE_URL,
  TAM_SUB_FAQ_DELETE_URL,
  TAM_SUB_FAQ_STATUS_URL,
  TAM_SUB_FAQ_UPDATE_URL,
  TAM_SUB_FAQS_QUERY_URL,
  TAM_SUB_FAQS_URL,
} from "utils/end-points.utils";

export type SubFaqContextType = {
  subFaqList: APIDataProps<SubFaqType[]>;
  faqs: FaqType[];
  subFaqs: SubFaqType[];
  loading: boolean;
  isAppDrawerOpen: boolean;
  subFaq: any;
  mode: string;
  page: number;
};

const ContextState: SubFaqContextType = {
  subFaqList: {} as APIDataProps<SubFaqType[]>,
  faqs: [],
  subFaqs: [],
  loading: false,
  isAppDrawerOpen: false,
  subFaq: {},
  mode: MODE_ADD,
  page: 0,
};

export type SubFaqActionContextType = {
  //setQueryParams: (data: object) => void;
  handleOnAddSubFaq: () => void;
  setSubFaq: (data: object) => void;
  handleOnSubmit: () => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnGetSubFaq: (data: SubFaqType) => void;
  handleOnUpdate: (data: object) => void;
  handleOnDelete: (subFaqId: string) => void;
  handleOnEnabledOrDisabled: (subFaqId: string) => void;
  onPageChange: (data: number) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
};

const SubFaqContext = createContext<SubFaqContextType>(ContextState);
const SubFaqActionsContext = createContext<SubFaqActionContextType>({
  //setQueryParams: (data: object) => {},
  handleOnAddSubFaq: () => {},
  setSubFaq: (data: object) => {},
  handleOnSubmit: () => {},
  setAppDrawerOpen: (data: boolean) => {},
  handleOnGetSubFaq: (data: SubFaqType) => {},
  handleOnUpdate: (data: object) => {},
  handleOnDelete: (subFaqId: string) => {},
  handleOnEnabledOrDisabled: (subFaqId: string) => {},
  onPageChange: (data: number) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
});

export const useSubFaqContext = () => useContext(SubFaqContext);

export const useSubFaqActionsContext = () => useContext(SubFaqActionsContext);

type Props = {
  children: ReactNode;
};

export const SubFaqContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const [subFaq, setSubFaq] = useState({
    title: "",
    description: "",
    faq: "",
  });
  const [subFaqId, setSubFaqId] = useState("");
  const [{ apiData: faqs }] = useGetDataApi<{ data: FaqType[] }>(TAM_FAQS_URL);
  const [{ apiData }] = useGetDataApi<{
    data: SubFaqType[];
  }>(TAM_SUB_FAQS_URL);
  const [{ apiData: subFaqList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<SubFaqType[]>>(
      `${TAM_SUB_FAQS_QUERY_URL}`,
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

  const handleOnAddSubFaq = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    setSubFaq({ title: "", description: "", faq: "" });
  };

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnSubmit = async () => {
    await jwtAxios
      .post(TAM_SUB_FAQ_CREATE_URL, subFaq)
      .then(({ data }) => {
        setSubFaq({ title: "", description: "", faq: "" });
        reCallAPI();
        setAppDrawerOpen(false);
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

  const handleOnUpdate = async (subFaq: object) => {
    await jwtAxios
      .put(`${TAM_SUB_FAQ_UPDATE_URL}/${subFaqId}`, subFaq)
      .then(({ data }) => {
        reCallAPI();
        setAppDrawerOpen(false);
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

  const handleOnEnabledOrDisabled = async (subFaqId: string) => {
    await jwtAxios
      .put(`${TAM_SUB_FAQ_STATUS_URL}/${subFaqId}`)
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

  const handleOnDelete = async (subFaqId: string) => {
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
          .delete(`${TAM_SUB_FAQ_DELETE_URL}/${subFaqId}`)
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

  const handleOnGetSubFaq = (subFaq: SubFaqType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setSubFaqId(subFaq._id);
    setSubFaq({
      title: subFaq.title,
      description: subFaq.description,
      faq: subFaq.faq._id,
    });
  };

  // Render
  return (
    <SubFaqContext.Provider
      value={{
        subFaqList,
        faqs: faqs?.data,
        subFaqs: apiData?.data,
        loading,
        isAppDrawerOpen,
        subFaq,
        mode,
        page,
      }}
    >
      <SubFaqActionsContext.Provider
        value={{
          handleOnAddSubFaq,
          setSubFaq,
          handleOnSubmit,
          setAppDrawerOpen,
          handleOnGetSubFaq,
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
      </SubFaqActionsContext.Provider>
    </SubFaqContext.Provider>
  );
};
