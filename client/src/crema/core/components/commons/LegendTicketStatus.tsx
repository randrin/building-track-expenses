import { Col, Row } from "antd";
import { BsClock } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useIntl } from "react-intl";

const LegendTicketStatus = () => {
  // States
  const { messages } = useIntl();

  // Render
  return (
    <Row>
      <Col
        xs={8}
        lg={8}
        className="tt-expenses-warning tt-expenses-space-grid-center "
      >
        <span className="tt-expenses-space-center">
          <BsClock />
        </span>
        <span>{messages["common.status.open"] as string}</span>
      </Col>
      <Col
        xs={8}
        lg={8}
        className="tt-expenses-secondary tt-expenses-space-grid-center "
      >
        <span className="tt-expenses-space-center">
          <IoIosCloseCircleOutline />
        </span>
        <span>{messages["common.status.closed"] as string}</span>
      </Col>
      <Col
        xs={8}
        lg={8}
        className="tt-expenses-success tt-expenses-space-grid-center "
      >
        <span className="tt-expenses-space-center">
          <FaRegCircleCheck />
        </span>
        <span>{messages["common.status.resolved"] as string}</span>
      </Col>
    </Row>
  );
};

export default LegendTicketStatus;
