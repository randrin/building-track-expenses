import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import Editor from "@crema/core/components/editor/Editor";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import SubFaqTable from "@crema/modules/dashboards/SubFaqs/subFaqTable";
import { SubFaqType } from "@crema/types/models/dashboards/SubFaqType";
import { Button, Col, Drawer, Input, Row, Select, Space } from "antd";
import {
  useSubFaqActionsContext,
  useSubFaqContext,
} from "modules/apps/context/SubFaqContextProvider";
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
} from "utils/common-constants.utils";
import { PermissionEnums } from "utils/permissions.utils";

const SubFaqsListing = () => {
  // States
  const { faqs, subFaq, loading, isAppDrawerOpen, mode, page, subFaqList } =
    useSubFaqContext();

  const {
    handleOnAddSubFaq,
    setAppDrawerOpen,
    setSubFaq,
    handleOnSubmit,
    handleOnUpdate,
    onPageChange,
  } = useSubFaqActionsContext();
  // States
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });

  // Destructing
  const { title, description, faq } = subFaq;
  const { TextArea } = Input;
  const { Option } = Select;

  // Functions
  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return subFaqList?.data;
    } else {
      return subFaqList?.data.filter((subFaq: SubFaqType) =>
        subFaq.title.toUpperCase().includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.subfaqs"] as string} />
      <StyledContent>
        <StyledTitle5>{messages["common.subfaqs"] as string}</StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_FAQ}
          component={
            <Button type="primary" className="btn" onClick={handleOnAddSubFaq}>
              <PlusOutlined /> <IntlMessages id="common.subfaq" />
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
                      id="subfaq-name"
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
                    count={subFaqList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <SubFaqTable subFaqData={list || []} loading={loading} />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={subFaqList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
            {/* Add and Update Sub Faq */}
            <Drawer
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.subfaq.create"
                    : "dashboard.subfaq.update"
                ] as string
              }
              width={950}
              placement={"right"}
              maskClosable={false}
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
                        : () => handleOnUpdate(subFaq)
                    }
                    disabled={
                      !!title?.length && !!description?.length && !!faq.length
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
                  <Col xs={24} lg={12} className="tt-category-col">
                    <label htmlFor="faq" className="label">
                      {messages["common.faq"] as string}{" "}
                      <StyledRequiredField>*</StyledRequiredField>
                    </label>
                    <Select
                      size="large"
                      value={faq || undefined}
                      showSearch
                      showArrow
                      style={{ width: "100%" }}
                      placeholder={messages["placeholder.select"] as string}
                      optionFilterProp="children"
                      onChange={(e) => setSubFaq({ ...subFaq, faq: e })}
                    >
                      {faqs
                        ?.filter((faq) => faq.status === StatusEnums.ACTIVE)
                        .map((faq, index) => (
                          <Option key={index} value={faq._id}>
                            {faq.name}
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
                    <TextArea
                      placeholder={messages["placeholder.input"] as string}
                      value={title}
                      name="title"
                      rows={2}
                      onChange={(e) =>
                        setSubFaq({
                          ...subFaq,
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
                    <Editor
                      value={description}
                      placeholder={messages["common.writeContent"] as string}
                      handleOnEditorChange={(e) =>
                        setSubFaq({
                          ...subFaq,
                          description: e,
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

export default AdminManagerPermission(SubFaqsListing);
