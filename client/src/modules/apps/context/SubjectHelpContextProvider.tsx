import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { APIDataProps } from "@crema/types/models/APIDataProps";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { SubCategoryType } from "@crema/types/models/dashboards/SubCategoryType";
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
  TAM_SUPPORT_CATEGORIES_URL,
  TAM_SUPPORT_SUBJECT_CREATE_URL,
  TAM_SUPPORT_SUBJECT_DELETE_URL,
  TAM_SUPPORT_SUBJECT_STATUS_URL,
  TAM_SUPPORT_SUBJECT_UPDATE_URL,
  TAM_SUPPORT_SUBJECTS_QUERY_URL,
  TAM_SUPPORT_SUBJECTS_URL,
} from "utils/end-points.utils";

export type SubFaqContextType = {
  subjectList: APIDataProps<SubCategoryType[]>;
  categories: CategoryType[];
  subjects: SubCategoryType[];
  loading: boolean;
  isAppDrawerOpen: boolean;
  subject: any;
  mode: string;
  page: number;
};

const ContextState: SubFaqContextType = {
  subjectList: {} as APIDataProps<SubCategoryType[]>,
  categories: [],
  subjects: [],
  loading: false,
  isAppDrawerOpen: false,
  subject: {},
  mode: MODE_ADD,
  page: 0,
};

export type SubFaqActionContextType = {
  //setQueryParams: (data: object) => void;
  handleOnAddSubject: () => void;
  setSubject: (data: object) => void;
  handleOnSubmit: () => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnGetSubject: (data: SubCategoryType) => void;
  handleOnUpdate: (data: object) => void;
  handleOnDeleteSubject: (subjectId: string) => void;
  handleOnEnabledOrDisabledSubject: (subjectId: string) => void;
  onPageChange: (data: number) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
};

const SubjectContext = createContext<SubFaqContextType>(ContextState);
const SubjectActionsContext = createContext<SubFaqActionContextType>({
  //setQueryParams: (data: object) => {},
  handleOnAddSubject: () => {},
  setSubject: (data: object) => {},
  handleOnSubmit: () => {},
  setAppDrawerOpen: (data: boolean) => {},
  handleOnGetSubject: (data: SubCategoryType) => {},
  handleOnUpdate: (data: object) => {},
  handleOnDeleteSubject: (subjectId: string) => {},
  handleOnEnabledOrDisabledSubject: (subjectId: string) => {},
  onPageChange: (data: number) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
});

export const useSubjectContext = () => useContext(SubjectContext);

export const useSubjectActionsContext = () => useContext(SubjectActionsContext);

type Props = {
  children: ReactNode;
};

export const SubjectHelpContextProvider = ({ children }: Props) => {
  // States
  const router = useRouter();
  const { asPath } = router;
  const { messages } = useIntl();
  const [mode, setMode] = useState(MODE_ADD);
  const [page, setPage] = useState(0);
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const [subject, setSubject] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [subjectId, setSubjectId] = useState("");

  const [{ apiData: categories }] = useGetDataApi<{ data: CategoryType[] }>(
    TAM_SUPPORT_CATEGORIES_URL
  );

  const [{ apiData }] = useGetDataApi<{
    data: SubCategoryType[];
  }>(TAM_SUPPORT_SUBJECTS_URL);

  const [{ apiData: subjectList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<SubCategoryType[]>>(
      `${TAM_SUPPORT_SUBJECTS_QUERY_URL}`,
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

  const handleOnAddSubject = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    setSubject({ title: "", description: "", category: "" });
  };

  const handleOnGetMessage = (message: string) => {
    return messages[message] as string;
  };

  const handleOnSubmit = async () => {
    await jwtAxios
      .post(TAM_SUPPORT_SUBJECT_CREATE_URL, subject)
      .then(({ data }) => {
        setSubject({ title: "", description: "", category: "" });
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

  const handleOnUpdate = async (subject: object) => {
    await jwtAxios
      .put(`${TAM_SUPPORT_SUBJECT_UPDATE_URL}/${subjectId}`, subject)
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

  const handleOnEnabledOrDisabledSubject = async (subjectId: string) => {
    await jwtAxios
      .put(`${TAM_SUPPORT_SUBJECT_STATUS_URL}/${subjectId}`)
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

  const handleOnDeleteSubject = async (subjectId: string) => {
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
          .delete(`${TAM_SUPPORT_SUBJECT_DELETE_URL}/${subjectId}`)
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

  const handleOnGetSubject = (subject: SubCategoryType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setSubjectId(subject._id);
    setSubject({
      title: subject.title,
      description: subject.description,
      category: subject.category._id,
    });
  };

  // Render
  return (
    <SubjectContext.Provider
      value={{
        subjectList,
        categories: categories?.data,
        subjects: apiData?.data,
        loading,
        isAppDrawerOpen,
        subject,
        mode,
        page,
      }}
    >
      <SubjectActionsContext.Provider
        value={{
          handleOnAddSubject,
          setSubject,
          handleOnSubmit,
          setAppDrawerOpen,
          handleOnGetSubject,
          onPageChange,
          handleOnUpdate,
          handleOnDeleteSubject,
          handleOnEnabledOrDisabledSubject,
          //setQueryParams,
          reCallAPI,
          setPage,
        }}
      >
        {children}
      </SubjectActionsContext.Provider>
    </SubjectContext.Provider>
  );
};
