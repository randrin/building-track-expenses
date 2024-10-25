import AppIconButton from "@crema/components/AppIconButton";
import IntlMessages from "@crema/helpers/IntlMessages";
import { ExpenseType } from "@crema/types/models/dashboards/ExpenseType";
import { Dropdown, Space } from "antd";
import {
  useAccountingActionsContext,
  useAccountingContext,
} from "modules/apps/context/AccountingContextProvider";
import { CiCircleMore } from "react-icons/ci";
import { FaCheck, FaChevronLeft } from "react-icons/fa";
import { VscEye } from "react-icons/vsc";
import {
  useExpenseActionsContext,
  useExpenseContext,
} from "../../../../../modules/apps/context/ExpenseContextProvider";

type Props = {
  expense: ExpenseType;
};

const AccountingActions = ({ expense }: Props) => {
  // States
  const { comment, isReject, isApproval } = useAccountingContext();
  const { handleOnAccountingExpense, setIsReject, setIsApproval} =
    useAccountingActionsContext();
  const { setAppDrawerOpen, setExpense } = useExpenseActionsContext();
  const { isAppDrawerOpen } = useExpenseContext();

  // Destructing

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
            <FaCheck className="tt-expenses-success tt-expenses-margin-btn-icon" />{" "}
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
  const handleOnApprovalExpense = () => {
    setIsApproval(!isApproval);
    setExpense({ ...expense, expenseId: expense._id });
  };

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

  const handleOnViewExpense = () => {
    setAppDrawerOpen(!isAppDrawerOpen);
    setExpense({ ...expense, expenseId: expense._id });
  };

  // Render
  return (
    <Dropdown menu={{ items, onClick: onMenuClick }} trigger={["click"]}>
      <AppIconButton icon={<CiCircleMore />} />
    </Dropdown>
  );
};
export default AccountingActions;
