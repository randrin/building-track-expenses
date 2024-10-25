import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { SubCategoryType } from "@crema/types/models/dashboards/SubCategoryType";
import { TicketType } from "@crema/types/models/dashboards/TicketType";
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
import { MODE_ADD, MODE_EDIT, TicketEnums } from "utils/common-constants.utils";
import {
  TAM_SUPPORT_CATEGORIES_QUERY_URL,
  TAM_SUPPORT_CATEGORIES_URL,
  TAM_SUPPORT_CATEGORY_CREATE_URL,
  TAM_SUPPORT_CATEGORY_DELETE_URL,
  TAM_SUPPORT_CATEGORY_STATUS_URL,
  TAM_SUPPORT_CATEGORY_UPDATE_URL,
  TAM_SUPPORT_HELPS_QUERY_URL,
  TAM_SUPPORT_HELPS_URL,
  TAM_SUPPORT_HELP_CREATE_URL,
  TAM_SUPPORT_HELP_REPLY_URL,
  TAM_SUPPORT_HEPL_STATUS_URL,
  TAM_SUPPORT_SUBJECTS_BY_CATEGORY_URL,
} from "utils/end-points.utils";

export type SupportHelpContextContext = {
  ticketList: APIDataProps<TicketType[]>;
  tickets: TicketType[];
  categoryList: APIDataProps<CategoryType[]>;
  categories: CategoryType[];
  subjects: SubCategoryType[];
  loadingTicket: boolean;
  loadingCategory: boolean;
  isAppDrawerOpen: boolean;
  category: any;
  ticket: any;
  ticketComment: any;
  mode: string;
  page: number;
};

const ContextState: SupportHelpContextContext = {
  ticketList: {} as APIDataProps<TicketType[]>,
  tickets: [],
  categoryList: {} as APIDataProps<CategoryType[]>,
  categories: [],
  subjects: [],
  loadingTicket: false,
  loadingCategory: false,
  isAppDrawerOpen: false,
  category: {},
  ticket: {},
  ticketComment: {},
  mode: MODE_ADD,
  page: 0,
};

export type SupportHelpContextActionsContext = {
  //setQueryParams: (data: object) => void;
  handleOnAddCategory: () => void;
  setTicket: (data: object) => void;
  setTicketComment: (data: object) => void;
  setCategory: (data: object) => void;
  handleOnSubmitTicket: () => void;
  handleOnReplyTicket: () => void;
  handleOnSubmitCategoryHelp: () => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnGetTicket: (ticketId: string) => void;
  handleOnGetCategoryHelp: (data: CategoryType) => void;
  handleOnUpdateCategoryHelp: (categoryId: string, data: object) => void;
  handleOnDeleteCategoryHelp: (categoryId: string) => void;
  handleOnEnabledOrDisabledCategoryHelp: (categoryId: string) => void;
  handleOnGetSubjectsByCategory: (category: string) => void;
  onPageChange: (data: number) => void;
  reCallTicketAPI: () => void;
  reCallCategoryAPI: () => void;
  setPage: (data: number) => void;
  handleOnChangeStatusTicket: (status: string) => void;
  handleOnSelectTicketsByStatus: (status: string) => void;
};

const SupportHelpContext =
  createContext<SupportHelpContextContext>(ContextState);
const SupportHelpActionsContext =
  createContext<SupportHelpContextActionsContext>({
    //setQueryParams: (data: object) => {},
    handleOnAddCategory: () => {},
    setTicket: (data: object) => {},
    setTicketComment: (data: object) => {},
    setCategory: (data: object) => {},
    handleOnSubmitTicket: () => {},
    handleOnReplyTicket: () => {},
    handleOnSubmitCategoryHelp: () => {},
    setAppDrawerOpen: (data: boolean) => {},
    handleOnGetTicket: (ticketId: string) => {},
    handleOnGetCategoryHelp: (data: CategoryType) => {},
    handleOnUpdateCategoryHelp: (categoryId: string, data: object) => {},
    handleOnDeleteCategoryHelp: (categoryId: string) => {},
    handleOnEnabledOrDisabledCategoryHelp: (categoryId: string) => {},
    handleOnGetSubjectsByCategory: (category: string) => {},
    onPageChange: (data: number) => {},
    reCallTicketAPI: () => {},
    reCallCategoryAPI: () => {},
    setPage: (data: number) => {},
    handleOnChangeStatusTicket: (status: string) => {},
    handleOnSelectTicketsByStatus: (status: string) => {},
  });

export const useSupportHelpContext = () => useContext(SupportHelpContext);

export const useSupportHelpActionsContext = () =>
  useContext(SupportHelpActionsContext);

type Props = {
  children: ReactNode;
};

export const SupportHelpContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const [category, setCategory] = useState({
    title: "",
    description: "",
  });
  const [ticket, setTicket] = useState({
    ticketId: "",
    category: "",
    subject: "",
    object: "",
    message: "",
    attachments: [],
    createdBy: {},
    comments: [],
  });
  const [ticketComment, setTicketComment] = useState({
    ticketId: "",
    message: "",
    type: "",
    attachments: [],
    createdBy: {},
  });
  const [subjects, setSubjects] = useState<SubCategoryType[]>([]);
  const [
    { apiData: ticketList, loading: loadingTicket },
    {
      setQueryParams: setQueryTicketParams,
      reCallAPI: reCallTicketAPI,
      setData,
      setLoading,
    },
  ] = useGetDataApi<APIDataProps<TicketType[]>>(
    `${TAM_SUPPORT_HELPS_QUERY_URL}/${TicketEnums.OPEN}`,
    undefined,
    { page: page },
    false
  );
  const [{ apiData: apiDataTicket }] = useGetDataApi<{
    data: TicketType[];
  }>(TAM_SUPPORT_HELPS_URL);

  const [
    { apiData: categoryList, loading: loadingCategory },
    { setQueryParams: setQueryCategoryParams, reCallAPI: reCallCategoryAPI },
  ] = useGetDataApi<APIDataProps<CategoryType[]>>(
    `${TAM_SUPPORT_CATEGORIES_QUERY_URL}`,
    undefined,
    { page: page },
    false
  );
  const [{ apiData: apiDataCategory }] = useGetDataApi<{
    data: CategoryType[];
  }>(TAM_SUPPORT_CATEGORIES_URL);

  // Destructing
  const confirm = Modal.confirm;

  // Init
  useEffect(() => {
    setPage(1);
  }, [asPath]);

  useEffect(() => {
    setQueryCategoryParams({
      page: page,
    });
    setQueryTicketParams({
      page: page,
    });
  }, [page, asPath]);

  // Functions
  const onPageChange = (value: number) => {
    setPage(value);
  };

  const handleOnAddCategory = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    setCategory({ title: "", description: "" });
  };

  const handleOnSubmitTicket = async () => {
    await jwtAxios
      .post(TAM_SUPPORT_HELP_CREATE_URL, ticket)
      .then(({ data }) => {
        resetTicket();
        reCallTicketAPI();
        router.back();
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

  const handleOnReplyTicket = async () => {
    await jwtAxios
      .post(
        `${TAM_SUPPORT_HELP_REPLY_URL}/${ticketComment.ticketId}`,
        ticketComment
      )
      .then(({ data }) => {
        handleOnGetTicket(data.data._id);
        resetTicketComment();
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

  const handleOnChangeStatusTicket = async (status: string) => {
    await jwtAxios
      .put(`${TAM_SUPPORT_HEPL_STATUS_URL}/${status}/${ticket.ticketId}`)
      .then(({ data }) => {
        handleOnGetTicket(data.ticket._id);
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

  const handleOnGetTicket = async (ticketId: string) => {
    await jwtAxios
      .get(`${TAM_SUPPORT_HELPS_URL}/${ticketId}`)
      .then(({ data }) => {
        setTicket({
          ticketId: data.ticket._id,
          ...data.ticket,
        });
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  const handleOnSelectTicketsByStatus = async (status: string) => {
    await jwtAxios
      .get(`${TAM_SUPPORT_HELPS_QUERY_URL}/${status}`)
      .then(({ data }) => {
        setLoading(true);
        setTimeout(() => {
          setData(data);
          setLoading(false);
        }, 500);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(
          error.response.data.message || error.response.data.message[0]
        );
      });
  };

  const resetTicket = () => {
    setTicket({
      ticketId: "",
      category: "",
      subject: "",
      object: "",
      message: "",
      attachments: [],
      createdBy: {},
      comments: [],
    });
  };

  const resetTicketComment = () => {
    setTicketComment({
      ticketId: "",
      message: "",
      type: "",
      attachments: [],
      createdBy: {},
    });
  };

  const handleOnSubmitCategoryHelp = async () => {
    await jwtAxios
      .post(TAM_SUPPORT_CATEGORY_CREATE_URL, category)
      .then(({ data }) => {
        setCategory({ title: "", description: "" });
        reCallCategoryAPI();
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

  const handleOnUpdateCategoryHelp = async (
    categoryId: string,
    category: object
  ) => {
    await jwtAxios
      .put(`${TAM_SUPPORT_CATEGORY_UPDATE_URL}/${categoryId}`, category)
      .then(({ data }) => {
        reCallCategoryAPI();
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

  const handleOnEnabledOrDisabledCategoryHelp = async (categoryId: string) => {
    await jwtAxios
      .put(`${TAM_SUPPORT_CATEGORY_STATUS_URL}/${categoryId}`)
      .then(({ data }) => {
        reCallCategoryAPI();
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

  const handleOnDeleteCategoryHelp = async (categoryId: string) => {
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
          .delete(`${TAM_SUPPORT_CATEGORY_DELETE_URL}/${categoryId}`)
          .then(({ data }) => {
            reCallCategoryAPI();
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

  const handleOnGetCategoryHelp = (category: CategoryType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setCategory(category);
  };

  const handleOnGetSubjectsByCategory = async (category: string) => {
    setTicket({ ...ticket, category: category, subject: "" });
    await jwtAxios
      .get(`${TAM_SUPPORT_SUBJECTS_BY_CATEGORY_URL}/${category}`)
      .then(({ data }) => {
        setSubjects(data.data);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        message.error(error.response.data.message[0]);
      });
  };

  // Render
  return (
    <SupportHelpContext.Provider
      value={{
        ticketList,
        tickets: apiDataTicket?.data,
        categoryList,
        categories: apiDataCategory?.data,
        subjects,
        loadingTicket,
        loadingCategory,
        isAppDrawerOpen,
        ticket,
        ticketComment,
        category,
        mode,
        page,
      }}
    >
      <SupportHelpActionsContext.Provider
        value={{
          handleOnAddCategory,
          setTicket,
          setCategory,
          handleOnSubmitCategoryHelp,
          handleOnSubmitTicket,
          handleOnReplyTicket,
          setAppDrawerOpen,
          handleOnGetTicket,
          handleOnGetCategoryHelp,
          onPageChange,
          handleOnUpdateCategoryHelp,
          handleOnDeleteCategoryHelp,
          handleOnEnabledOrDisabledCategoryHelp,
          handleOnGetSubjectsByCategory,
          setTicketComment,
          reCallTicketAPI,
          reCallCategoryAPI,
          setPage,
          handleOnChangeStatusTicket,
          handleOnSelectTicketsByStatus,
        }}
      >
        {children}
      </SupportHelpActionsContext.Provider>
    </SupportHelpContext.Provider>
  );
};

export default SupportHelpContextProvider;
