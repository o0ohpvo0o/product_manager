import ReactDOM from "react-dom";
import "./Alert.css";
const Alert = (props) => {
  const { isDisplayed } = props;

  const content = (
    <div className={`alert ${isDisplayed ? "display" : ""}`}>
      <p className={props.className}>{props.message}</p>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("alert-hook"));
};

export default Alert;
