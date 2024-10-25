import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import SecuredPermission from "@crema/core/components/middlewares/SecuredPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import FaqTable from "@crema/modules/dashboards/Faqs/faqsTable";
import { FaqType } from "@crema/types/models/dashboards/FaqType";
import { Button, Col, Input, Modal, Row, Space } from "antd";
import {
  useFaqActionsContext,
  useFaqContext,
} from "modules/apps/context/FaqContextProvider";
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

const FaqsListing = () => {
  // States
  const { faqList, loading, isAppModalOpen, faq, mode, page } = useFaqContext();
  const {
    setAppModalOpen,
    handleOnSubmit,
    handleOnUpdate,
    setFaq,
    onPageChange,
    handleOnAddFaq,
  } = useFaqActionsContext();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });

  // Functions
  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return faqList?.data;
    } else {
      return faqList?.data.filter((faq: FaqType) =>
        faq.name.toUpperCase().includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["sidebar.app.dashboard.faqs"] as string} />
      <StyledContent>
        <StyledTitle5>
          {messages["sidebar.app.dashboard.faqs"] as string}
        </StyledTitle5>
        <SecuredPermission
          permission={PermissionEnums.ADD_FAQ}
          component={
            <Button
              type="primary"
              className="btn"
              onClick={handleOnAddFaq}
              style={{ marginBottom: 16 }}
            >
              <PlusOutlined /> <IntlMessages id="common.faq" />
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
                      id="faq-name"
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
                    count={faqList?.count || 0}
                    page={page}
                    onChange={onPageChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <FaqTable faqData={list || []} loading={loading} />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={faqList?.count || 0}
              page={page}
              onChange={onPageChange}
            />
            {/* Add and Update Faq */}
            <Modal
              centered
              title={
                messages[
                  mode === MODE_ADD
                    ? "dashboard.faq.create"
                    : "dashboard.faq.update"
                ] as string
              }
              open={isAppModalOpen}
              onCancel={() => setAppModalOpen(!isAppModalOpen)}
              footer={
                <Space>
                  <Button
                    className="tt-expenses-space-center"
                    onClick={() => setAppModalOpen(!isAppModalOpen)}
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
                        : () => handleOnUpdate(faq._id, faq)
                    }
                    disabled={!!faq.name?.length ? false : true}
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
                      value={faq.name}
                      size="large"
                      name="faq"
                      onChange={(e) => setFaq({ ...faq, name: e.target.value })}
                    />
                  </Col>
                </Row>
              </StyledCategoryContainer>
            </Modal>
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminManagerPermission(FaqsListing);
