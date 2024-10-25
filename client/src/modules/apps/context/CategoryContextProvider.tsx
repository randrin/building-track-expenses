import { useGetDataApi } from "@crema/hooks/APIHooks";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { Modal, message, notification } from "antd";
import { MODE_ADD, MODE_EDIT } from "utils/common-constants.utils";
import {
  TAM_CATEGORIES_QUERY_URL,
  TAM_CATEGORIES_URL,
  TAM_CATEGORY_CREATE_URL,
  TAM_CATEGORY_DELETE_URL,
  TAM_CATEGORY_STATUS_URL,
  TAM_CATEGORY_UPDATE_URL,
} from "utils/end-points.utils";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { APIDataProps } from "@crema/types/models/APIDataProps";

export type CategoryContextType = {
  categoryList: APIDataProps<CategoryType[]>;
  categories: CategoryType[];
  loading: boolean;
  isAppDrawerOpen: boolean;
  category: any;
  mode: string;
  page: number;
};

const ContextState: CategoryContextType = {
  categoryList: {} as APIDataProps<CategoryType[]>,
  categories: [],
  loading: false,
  isAppDrawerOpen: false,
  category: {},
  mode: MODE_ADD,
  page: 0,
};

export type CategoryActionContextType = {
  handleOnAddCategory: () => void;
  setCategory: (data: object) => void;
  handleOnSubmit: () => void;
  setAppDrawerOpen: (data: boolean) => void;
  handleOnGetCategory: (data: CategoryType) => void;
  handleOnUpdate: (categoryId: string, data: object) => void;
  handleOnDelete: (categoryId: string) => void;
  handleOnEnabledOrDisabled: (categoryId: string) => void;
  onPageChange: (data: number) => void;
  reCallAPI: () => void;
  setPage: (data: number) => void;
};

const CategoryContext = createContext<CategoryContextType>(ContextState);
const CategoryActionsContext = createContext<CategoryActionContextType>({
  handleOnAddCategory: () => {},
  setCategory: (data: object) => {},
  handleOnSubmit: () => {},
  setAppDrawerOpen: (data: boolean) => {},
  handleOnGetCategory: (data: CategoryType) => {},
  handleOnUpdate: (categoryId: string, data: object) => {},
  handleOnDelete: (categoryId: string) => {},
  handleOnEnabledOrDisabled: (categoryId: string) => {},
  onPageChange: (data: number) => {},
  reCallAPI: () => {},
  setPage: (data: number) => {},
});

export const useCategoryContext = () => useContext(CategoryContext);

export const useCategoryActionsContext = () =>
  useContext(CategoryActionsContext);

type Props = {
  children: ReactNode;
};

export const CategoryContextProvider = ({ children }: Props) => {
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
  const [{ apiData: categoryList, loading }, { setQueryParams, reCallAPI }] =
    useGetDataApi<APIDataProps<CategoryType[]>>(
      `${TAM_CATEGORIES_QUERY_URL}`,
      undefined,
      { page: page },
      false
    );
  const [{ apiData }] = useGetDataApi<{
    data: CategoryType[];
  }>(TAM_CATEGORIES_URL);

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

  const handleOnAddCategory = () => {
    setMode(MODE_ADD);
    setAppDrawerOpen(!isAppDrawerOpen);
    setCategory({ title: "", description: "" });
  };

  const handleOnSubmit = async () => {
    await jwtAxios
      .post(TAM_CATEGORY_CREATE_URL, category)
      .then(({ data }) => {
        setCategory({ title: "", description: "" });
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

  const handleOnUpdate = async (categoryId: string, category: object) => {
    await jwtAxios
      .put(`${TAM_CATEGORY_UPDATE_URL}/${categoryId}`, category)
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

  const handleOnEnabledOrDisabled = async (categoryId: string) => {
    await jwtAxios
      .put(`${TAM_CATEGORY_STATUS_URL}/${categoryId}`)
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

  const handleOnDelete = async (categoryId: string) => {
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
          .delete(`${TAM_CATEGORY_DELETE_URL}/${categoryId}`)
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

  const handleOnGetCategory = (category: CategoryType) => {
    setMode(MODE_EDIT);
    setAppDrawerOpen(!isAppDrawerOpen);
    setCategory(category);
  };

  // Render
  return (
    <CategoryContext.Provider
      value={{
        categoryList,
        categories: apiData?.data,
        loading,
        isAppDrawerOpen,
        category,
        mode,
        page,
      }}
    >
      <CategoryActionsContext.Provider
        value={{
          handleOnAddCategory,
          setCategory,
          handleOnSubmit,
          setAppDrawerOpen,
          handleOnGetCategory,
          onPageChange,
          handleOnUpdate,
          handleOnDelete,
          handleOnEnabledOrDisabled,
          reCallAPI,
          setPage,
        }}
      >
        {children}
      </CategoryActionsContext.Provider>
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
