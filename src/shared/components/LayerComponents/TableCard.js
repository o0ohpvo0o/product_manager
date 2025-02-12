import "./TableCard.css";
const TableCard = (props) => {
  return <div className={`data__collected ${props.className}`}>{props.children}</div>;
};

export default TableCard;
