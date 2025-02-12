import "./Modal.css";
import ReactDOM from "react-dom";
import { Fragment } from "react";
const ModalOverlay = (props) => {
  const { itemId, title, className, actionName } = props.data;

  const confirmActionHandler = () => {
    props.onAction(itemId);
  };
  const content = (
    <div className="modal">
      <h4 className={`modal__title ${className}`}>{title ? title : "Do you want to proceed?"}</h4>
      <form
        className="modal__actions"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <button type="button" className="btn-action cancel" onClick={props.onCancel}>
          Cancel
        </button>

        <button type="button" className={`btn-action ${className}`} onClick={confirmActionHandler}>
          {actionName}
        </button>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <Fragment>
      <ModalOverlay {...props} />
    </Fragment>
  );
};

export default Modal;
