import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import CategoryTable from "@crema/modules/dashboards/Categories/categoriesTable";
import { CategoryType } from "@crema/types/models/dashboards/CategoryType";
import { Button, Col, Drawer, Input, Row, Space } from "antd";
import {
  useSupportHelpActionsContext,
  useSupportHelpContext,
} from "modules/apps/context/SupportHelpContextProvider";
import {
  StyledCategoryContainer,
  StyledContent,
  StyledRequiredField,
} from "modules/dashboards/index.styled";
import { StyledTitle5 } from "modules/ecommerce/Admin/index.styled";
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
} from "modules/ecommerce/Orders/index.styled";
import { useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuCheckCircle } from "react-icons/lu";
import { useIntl } from "react-intl";
import {
  MODE_ADD,
  PAGE_SIZE_DEFAULT,
  StatusEnums,
  VIEW_TYPE,
} from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

const CategorySupportListing = () => {
  // States
  const {
    categoryList,
    loadingCategory,
    isAppDrawerOpen,
    category,
    mode,
    page,
  } = useSupportHelpContext();
  const {
    setAppDrawerOpen,
    handleOnSubmitCategoryHelp,
    handleOnUpdateCategoryHelp,
    setCategory,
    handleOnAddCategory,
    onPageChange,
  } = useSupportHelpActionsContext();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });

  // Desctruction
  const { title, description } = category;
  const { TextArea } = Input;

  // Init

  // Functions
  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return categoryList?.data;
    } else {
      return categoryList?.data.filter(
        (category: CategoryType) =>
          category.title
            .toUpperCase()
            .includes(filterData.title.toUpperCase()) ||
          category.description
            .toUpperCase()
            .includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.categories"] as string} />
      <StyledContent>
        <StyledTitle5>{messages["common.categories"] as string}</StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_CATEGORY}
          component={
            <Button
              type="primary"
              className="btn"
              onClick={handleOnAddCategory}
              style={{ marginBottom: 16 }}
            >
              <PlusOutlined /> <IntlMessages id="common.category" />
            </Button>
          }
        ></SecuredPermission>
      </StyledContent>
      <AppRowContainer>
        <Col xs={24} lg={24}>
          <AppCard
            title={
              <AppsHeader>
                <StyledOrderHeader>
                  <StyledOrderHeaderInputView>
                    <Input
                      id="category-name"
                      placeholder={messages["common.searchHere"] as string}
                      type="search"
                      onChange={(event) =>
                        setFilterData({
                          ...filterData,
                          title: event.target.value,
                        })
                      }
                    />
                  </StyledOrderHeaderInputView>
                  <StyledOrderHeaderPagination
                    pageSize={PAGE_SIZE_DEFAULT}
                    count={categoryList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <CategoryTable
              categoryData={list || []}
              loading={loadingCategory}
              type={VIEW_TYPE.SUPPORT}
            />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={categoryList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
            {/* Add and Update category */}
            <Drawer
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.category.create"
                    : "dashboard.category.update"
                ] as string
              }
              placement={"right"}
              open={isAppDrawerOpen}
              onClose={() => setAppDrawerOpen(!isAppDrawerOpen)}
              footer={
                <Space>
                  <Button
                    className="tt-expenses-space-center"
                    onClick={() => setAppDrawerOpen(!isAppDrawerOpen)}
                  >
                    <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
                    {messages["common.back"] as string}
                  </Button>
                  <Button
                    type="primary"
                    className="tt-expenses-space-center"
                    onClick={
                      mode === MODE_ADD
                        ? handleOnSubmitCategoryHelp
                        : () =>
                            handleOnUpdateCategoryHelp(category._id, category)
                    }
                    disabled={
                      !!title?.length && !!description.length ? false : true
                    }
                  >
                    <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
                    {messages["common.send"] as string}
                  </Button>
                </Space>
              }
            >
              <StyledCategoryContainer>
                <Row className="tt-category-row">
                  <Col xs={24} lg={24} className="tt-category-col">
                    <label htmlFor="category" className="label">
                      {messages["common.title"] as string}{" "}
                      <StyledRequiredField>*</StyledRequiredField>
                    </label>
                    <Input
                      placeholder={messages["placeholder.input"] as string}
                      value={title}
                      size="large"
                      name="category"
                      onChange={(e) =>
                        setCategory({ ...category, title: e.target.value })
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} lg={24}>
                    <label htmlFor="description" className="label">
                      {messages["common.description"] as string}{" "}
                      <StyledRequiredField>*</StyledRequiredField>
                    </label>
                    <TextArea
                      placeholder={messages["placeholder.input"] as string}
                      value={description}
                      name="description"
                      rows={4}
                      onChange={(e) =>
                        setCategory({
                          ...category,
                          description: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </StyledCategoryContainer>
            </Drawer>
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminManagerPermission(CategorySupportListing);
