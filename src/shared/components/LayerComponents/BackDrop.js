import ReactDOM from "react-dom";

import "./BackDrop.css";
const BackDrop = (props) => {
  // const { isDisplayed } = props;
  // const content = <div className={`backdrop ${isDisplayed ? "open" : ""}`} onClick={props.onClick}></div>;
  const content = <div className={`backdrop ${props.isDisplayed ? "display" : ""}`} onClick={props.onClick}></div>;
  return ReactDOM.createPortal(content, document.getElementById("backdrop-hook"));
};

export default BackDrop;
