import React, { Fragment, useCallback, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import BackDrop from "../../shared/components/LayerComponents/BackDrop";
import Modal from "../../shared/components/LayerComponents/Modal";
import Alert from "../../shared/components/UIComponents/Alert";
import useHttpClient from "../../shared/hooks/http-hooks";
import '../../common_css/LeadsTableBody.css'
const OthersTableBody = React.memo(
  (props) => {
    const { data, pageNum, onDelete } = props;
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
      itemId: null,
      title: null,
      className: "",
      actionName: null,
    });
    const { alert, sendAlert } = useHttpClient();

    const copyDataHandler = (item) => {
      const concatData = `${item.item}`;
      navigator.clipboard.writeText(concatData);

      sendAlert("Copied item to clipboard.", "success");
    };

    const showDeleteModalHandler = useCallback((item) => {
      setShowModal(true);
      setShowBackDrop(true);
      setModalData({
        itemId: item.id,
        title: `Delete '${item.number}' ?`,
        className: COMMON_VALUES.alertClass.danger,
        actionName: "Delete",
      });
    }, []);

    const cancelModalHandler = useCallback(() => {
      setShowModal(false);
      setShowBackDrop(false);
    }, []);

    const deleteItemHandler = useCallback(
      async (id) => {
        onDelete(id);

        setShowModal(false);
        setShowBackDrop(false);
      },
      [onDelete]
    );

    let content = COMMON_VALUES.othersTableBody;

    if (data.length > 0) {
      content = data.map((child, index) => (
        <tr key={child.id}>
          <td>{(pageNum - 1) * 10 + index + 1}</td>
          <td>{child.item}</td>
          <td>{child.type}</td>
          <td>{child.added}</td>
          <td>
            <button id={child.id} className="leads__btn copy" onClick={copyDataHandler.bind(null, child)}>
              Copy
            </button>
            <button id={child.id} className="leads__btn remove" onClick={showDeleteModalHandler.bind(null, child)}>
              Remove
            </button>
          </td>
        </tr>
      ));
    }

    return (
      <Fragment>
        <BackDrop isDisplayed={showBackDrop} />
        {showModal && <Modal data={modalData} onCancel={cancelModalHandler} onAction={deleteItemHandler} />}
        <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />
        {content}
      </Fragment>
    );
  },
  (prevProps, nextProps) => prevProps.data === nextProps.data && prevProps.pageNum === nextProps.pageNum
);

export default OthersTableBody;
