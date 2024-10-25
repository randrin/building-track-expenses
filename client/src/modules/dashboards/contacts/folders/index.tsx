import { PlusOutlined } from "@ant-design/icons";
import AppCard from "@crema/components/AppCard";
import AppPageMeta from "@crema/components/AppPageMeta";
import AppRowContainer from "@crema/components/AppRowContainer";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AdminManagerPermission from "@crema/core/components/middlewares/AdminManagerPermission";
import IntlMessages from "@crema/helpers/IntlMessages";
import FolderTable from "@crema/modules/dashboards/Contacts/Folders/FoldersTable";
import { FolderType } from "@crema/types/models/dashboards/ContactType";
import { Button, Col, Input, Modal, Row, Select } from "antd";
import {
  useContactsActionsContext,
  useContactsContext,
} from "modules/apps/context/ContactsContextProvider";
import {
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
  FolderEnums,
  MODE_ADD,
  PAGE_SIZE_DEFAULT,
  StatusEnums,
} from "utils/common-constants.utils";
import { Tt_IconByName } from "utils/common-functions.utils";

const Folders = () => {
  // States
  const { folderList, folderLoading, isFolderDrawerOpen, folder, modeFolder } =
    useContactsContext();
  const {
    setFolderDrawerOpen,
    handleOnSubmitFolder,
    handleOnUpdateFolder,
    setFolder,
    handleOnAddFolder,
  } = useContactsActionsContext();
  const { messages } = useIntl();
  const [filterData, setFilterData] = useState({
    title: "",
    description: "",
    status: [StatusEnums.ACTIVE, StatusEnums.DISABLED],
  });
  const [page, setPage] = useState(0);

  // Desctruction
  const { name, icon } = folder;
  const { Option } = Select;

  // Functions
  const onChange = (page: number) => {
    setPage(page);
  };

  const searchFolder = (title: string) => {
    setFilterData({ ...filterData, title });
  };

  const handleOnValidate = () => {
    return !!name?.length && !!icon?.length ? false : true;
  };

  const onGetFilteredItems = () => {
    if (filterData.title === "") {
      return folderList;
    } else {
      return folderList.filter((folder: FolderType) =>
        folder.name.toUpperCase().includes(filterData.title.toUpperCase())
      );
    }
  };

  const list = onGetFilteredItems();

  // Render
  return (
    <>
      <AppPageMeta title={messages["common.folders"] as string} />
      <StyledContent>
        <StyledTitle5>{messages["common.folders"] as string}</StyledTitle5>
        <Button type="primary" className="btn" onClick={handleOnAddFolder}>
          <PlusOutlined /> <IntlMessages id="common.folder" />
        </Button>
      </StyledContent>
      <AppRowContainer>
        <Col xs={24} lg={24}>
          <AppCard
            title={
              <AppsHeader>
                <StyledOrderHeader>
                  <StyledOrderHeaderInputView>
                    <Input
                      id="user-name"
                      placeholder={messages["common.searchHere"] as string}
                      type="search"
                      onChange={(event) => searchFolder(event.target.value)}
                    />
                  </StyledOrderHeaderInputView>
                  <StyledOrderHeaderPagination
                    pageSize={PAGE_SIZE_DEFAULT}
                    count={list?.length}
                    page={page}
                    onChange={onChange}
                  />
                </StyledOrderHeader>
              </AppsHeader>
            }
          >
            <FolderTable folderData={list || []} loading={folderLoading} />
            <StyledOrderFooterPagination
              pageSize={PAGE_SIZE_DEFAULT}
              count={list?.length}
              page={page}
              onChange={onChange}
            />
            <Modal
              centered
              open={isFolderDrawerOpen}
              title={
                messages[
                  modeFolder === MODE_ADD
                    ? "dashboard.folder.create"
                    : "dashboard.folder.update"
                ] as string
              }
              onOk={
                modeFolder === MODE_ADD
                  ? handleOnSubmitFolder
                  : () => handleOnUpdateFolder(folder._id, folder)
              }
              onCancel={() => setFolderDrawerOpen(!isFolderDrawerOpen)}
              footer={[
                <Button
                  key="back"
                  className="tt-expenses-space-center"
                  onClick={() => {
                    setFolder({});
                    setFolderDrawerOpen(!isFolderDrawerOpen);
                  }}
                >
                  <IoReturnUpBackOutline className="tt-expenses-margin-btn-icon" />{" "}
                  {messages["common.back"] as string}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  className="tt-expenses-space-center"
                  loading={folderLoading}
                  onClick={
                    modeFolder === MODE_ADD
                      ? handleOnSubmitFolder
                      : () => handleOnUpdateFolder(folder._id, folder)
                  }
                  disabled={handleOnValidate()}
                >
                  <LuCheckCircle className="tt-expenses-margin-btn-icon" />
                  {messages["common.submit"] as string}
                </Button>,
              ]}
            >
              <Row>
                <Col xs={24} lg={24}>
                  <label htmlFor="name" className="label">
                    {messages["common.name"] as string}{" "}
                    <i className="tt-expenses-primary">
                      ({messages["placeholder.folder.name.disabled"] as string})
                    </i>
                  </label>
                  <Input
                    placeholder={messages["placeholder.input"] as string}
                    value={name}
                    size="large"
                    name="name"
                    disabled
                    onChange={(e) =>
                      setFolder({
                        ...folder,
                        name: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={24}>
                  <label htmlFor="icon" className="label">
                    {messages["common.icon"] as string}{" "}
                    <StyledRequiredField>*</StyledRequiredField>
                  </label>
                  <Select
                    size="large"
                    value={icon || undefined}
                    showSearch
                    showArrow
                    style={{ width: "100%" }}
                    placeholder={<IntlMessages id="placeholder.select" />}
                    optionLabelProp="label"
                    optionFilterProp="label"
                    onChange={(e) =>
                      setFolder({
                        name: e,
                        icon: e,
                      })
                    }
                  >
                    {Object.values(FolderEnums)?.map((icn, index) => (
                      <Option
                        key={index}
                        value={icn}
                        label={
                          <div className="tt-expenses-space-start">
                            {Tt_IconByName[icn]}
                            <span className="ml-4">
                              {
                                <IntlMessages
                                  id={`common.icon.${icn
                                    .replaceAll("-", ".")
                                    .toLocaleLowerCase()}`}
                                />
                              }
                            </span>
                          </div>
                        }
                      >
                        <div className="tt-expenses-space-start">
                          {Tt_IconByName[icn]}
                          <span className="ml-4">
                            {
                              <IntlMessages
                                id={`common.icon.${icn
                                  .replaceAll("-", ".")
                                  .toLocaleLowerCase()}`}
                              />
                            }
                          </span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Modal>
          </AppCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminManagerPermission(Folders);
