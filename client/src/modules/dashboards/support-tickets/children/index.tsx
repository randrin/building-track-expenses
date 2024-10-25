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
} from "../../index.styled";
import {
  useSubjectActionsContext,
  useSubjectContext,
} from "modules/apps/context/SubjectHelpContextProvider";

const SubjectsListing = () => {
  // States
  const {
    categories,
    subjectList,
    loading,
    isAppDrawerOpen,
    subject,
    mode,
    page,
  } = useSubjectContext();

  const {
    setAppDrawerOpen,
    handleOnSubmit,
    handleOnUpdate,
    setSubject,
    handleOnAddSubject,
    onPageChange,
  } = useSubjectActionsContext();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });

  // Desctruction
  const { title, description, category } = subject;
  const { TextArea } = Input;
  const { Option } = Select;

  // Functions
  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return subjectList?.data;
    } else {
      return subjectList?.data.filter(
        (subject: SubCategoryType) =>
          subject.title
            .toUpperCase()
            .includes(filterData.title.toUpperCase()) ||
          subject.description
            .toUpperCase()
            .includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.subjects"] as string} />
      <StyledContent>
        <StyledTitle5>{messages["common.subjects"] as string}</StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_SUB_CATEGORY}
          component={
            <Button type="primary" className="btn" onClick={handleOnAddSubject}>
              <PlusOutlined /> <IntlMessages id="common.subject" />
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
                      id="subject-name"
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
                    count={subjectList?.count || 0}
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
              type={VIEW_TYPE.SUPPORT}
            />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={subjectList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
            {/* Add and Update Subject */}
            <Drawer
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.subject.create"
                    : "dashboard.subject.update"
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
                        : () => handleOnUpdate(subject)
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
                      onChange={(e) => setSubject({ ...subject, category: e })}
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
                    <label htmlFor="title" className="label">
                      {messages["common.title"] as string}{" "}
                      <StyledRequiredField>*</StyledRequiredField>
                    </label>
                    <Input
                      placeholder={messages["placeholder.input"] as string}
                      value={title}
                      size="large"
                      name="title"
                      onChange={(e) =>
                        setSubject({
                          ...subject,
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
                        setSubject({
                          ...subject,
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

export default AdminManagerPermission(SubjectsListing);
