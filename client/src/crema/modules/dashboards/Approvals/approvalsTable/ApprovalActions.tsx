import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { Dropdown, Input, Modal, Space } from "antd";
import {
  useApprovalActionsContext,
  useApprovalContext,
} from "modules/apps/context/ApprovalContextProvider";
import { useExpenseActionsContext } from "modules/apps/context/ExpenseContextProvider";
import { CiCircleMore } from "react-icons/ci";
import { FaChevronLeft } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { VscEye } from "react-icons/vsc";
import { useIntl } from "react-intl";

type Props = {
  expense: ExpenseType;
};

const ApprovalActions = ({ expense }: Props) => {
  // States
  const { messages } = useIntl();
  const confirm = Modal.confirm;
  const { isApproval, isReject } = useApprovalContext();
  const { setIsApproval, setIsReject } = useApprovalActionsContext();
  const { setAppDrawerOpen, setExpense } = useExpenseActionsContext();

  // Destructing
  const { TextArea } = Input;

  // Init
  const items = [
    {
      key: 1,
      label: (
        <Space wrap>
          <span style={{ fontSize: 14 }} className="tt-expenses-space-center">
            <VscEye className="tt-expenses-primary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.view" />
          </span>
        </Space>
      ),
    },
    {
      key: 2,
      label: (
        <Space wrap>
          <span style={{ fontSize: 14 }} className="tt-expenses-space-center">
            <FaMoneyBillTransfer className="tt-expenses-secondary tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.accept" />
          </span>
        </Space>
      ),
    },
    {
      key: 3,
      label: (
        <Space wrap>
          <span style={{ fontSize: 14 }} className="tt-expenses-space-center">
            <FaChevronLeft className="tt-expenses-tomato tt-expenses-margin-btn-icon" />{" "}
            <IntlMessages id="common.reject" />
          </span>
        </Space>
      ),
    },
  ];

  // Functions
  const onMenuClick = ({ item, key }: { item: any; key: string }) => {
    switch (key) {
      case "1":
        handleOnViewExpense();
        break;
      case "2":
        handleOnApprovalExpense();
        break;
      case "3":
        handleOnRejectExpense();
        break;
      default:
        break;
    }
  };

  const handleOnRejectExpense = () => {
    setIsReject(!isReject);
    setExpense({ ...expense, expenseId: expense._id });
  };

  const handleOnApprovalExpense = () => {
    setIsApproval(!isApproval);
    setExpense({ ...expense, expenseId: expense._id });
  };

  const handleOnViewExpense = () => {
    setAppDrawerOpen(true);
    setExpense({ ...expense, expenseId: expense._id });
  };

  // Render
  return (
    <Dropdown menu={{ items, onClick: onMenuClick }} trigger={["click"]}>
      <AppIconButton icon={<CiCircleMore />} />
    </Dropdown>
  );
};
export default ApprovalActions;
