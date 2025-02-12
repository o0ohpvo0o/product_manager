import ReactDOM from "react-dom";
import "./Loader.css";
const Loader = (props) => {
  const content = <div className="loader"></div>;
  return ReactDOM.createPortal(content, document.getElementById("loader-hook"));
};

export default Loader;
