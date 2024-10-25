import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import SubCategoryTable from "@crema/modules/dashboards/SubCategories/subcategoriesTable";
import { SubCategoryType } from "@crema/types/models/dashboards/SubCategoryType";
import { Button, Col, Drawer, Input, Row, Select, Space } from "antd";
import {
  useSubCategoryActionsContext,
  useSubCategoryContext,
} from "modules/apps/context/SubCategoryContextProvider";
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
import {
  StyledCategoryContainer,
  StyledContent,
  StyledRequiredField,
} from "../index.styled";

const SubCategoriesListing = () => {
  // States
  const {
    categories,
    subcategoryList,
    loading,
    isAppDrawerOpen,
    subCategory,
    mode,
    page,
  } = useSubCategoryContext();

  const {
    setAppDrawerOpen,
    handleOnSubmit,
    handleOnUpdate,
    setSubCategory,
    handleOnAddSubCategory,
    onPageChange,
  } = useSubCategoryActionsContext();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });

  // Desctruction
  const { title, description, category } = subCategory;
  const { TextArea } = Input;
  const { Option } = Select;

  // Functions
  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return subcategoryList?.data;
    } else {
      return subcategoryList?.data.filter(
        (subcategory: SubCategoryType) =>
          subcategory.title
            .toUpperCase()
            .includes(filterData.title.toUpperCase()) ||
          subcategory.description
            .toUpperCase()
            .includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.subcategories"] as string} />
      <StyledContent>
        <StyledTitle5>
          {messages["common.subcategories"] as string}
        </StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_SUB_CATEGORY}
          component={
            <Button
              type="primary"
              className="btn"
              onClick={handleOnAddSubCategory}
            >
              <PlusOutlined /> <IntlMessages id="common.subcategory" />
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
                      id="subcategory-name"
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
                    count={subcategoryList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <SubCategoryTable
              subCategoryData={list || []}
              loading={loading}
              type={VIEW_TYPE.SUBCATEGORY}
            />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={subcategoryList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
            {/* Add and Update Sub category */}
            <Drawer
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.subcategory.create"
                    : "dashboard.subcategory.update"
                ] as string
              }
              placement={"right"}
              open={isAppDrawerOpen}
              onClose={() => setAppDrawerOpen(!isAppDrawerOpen)}
              footer={
                <Space>
                  <Button
                    type="default"
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
                        ? handleOnSubmit
                        : () => handleOnUpdate(subCategory)
                    }
                    disabled={
                      !!title?.length &&
                      !!description.length &&
                      !!category.length
                        ? false
                        : true
                    }
                  >
                    <LuCheckCircle className="tt-expenses-margin-btn-icon" />{" "}
                    {messages["common.send"] as string}
                  </Button>
                </Space>
              }
            >
              <StyledCategoryContainer>
                <Row>
                  <Col xs={24} lg={24} className="tt-category-col">
                    <label htmlFor="category" className="label">
                      {messages["common.category"] as string}{" "}
                      <StyledRequiredField>*</StyledRequiredField>
                    </label>
                    <Select
                      size="large"
                      value={category || undefined}
                      showSearch
                      showArrow
                      style={{ width: "100%" }}
                      placeholder={messages["placeholder.select"] as string}
                      optionFilterProp="children"
                      onChange={(e) =>
                        setSubCategory({ ...subCategory, category: e })
                      }
                    >
                      {categories
                        ?.filter((cat) => cat.status === StatusEnums.ACTIVE)
                        .map((cat, index) => (
                          <Option key={index} value={cat._id}>
                            {cat.title}
                          </Option>
                        ))}
                    </Select>
                  </Col>
                </Row>
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
                        setSubCategory({
                          ...subCategory,
                          title: e.target.value,
                        })
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
                      placeholder={messages["placeholder.textarea"] as string}
                      value={description}
                      name="description"
                      rows={4}
                      onChange={(e) =>
                        setSubCategory({
                          ...subCategory,
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

export default AdminManagerPermission(SubCategoriesListing);
