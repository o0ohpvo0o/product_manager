import "./Header.css";
import Home_Icon from "../../images/hacker.png";
import Messenger_Icon from "../../images/messenger.png";
import SIGNOUT_ICON from "../../images/exit.png";
import { Link } from "react-router-dom";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import BackDrop from "../LayerComponents/BackDrop";
import Modal from "../LayerComponents/Modal";
import { AuthContext } from "../../contexts/auth-context";
import { COMMON_VALUES } from "../../common/SharedValues";
import useHttpClient from "../../hooks/http-hooks";

const Header = (props) => {
  const { logout, token } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    itemId: null,
    title: null,
    className: "",
    actionName: null,
  });

  const showSignoutModalHandler = useCallback((props) => {
    setShowModal(true);
    setShowBackDrop(true);

    setModalData({
      itemId: null,
      title: `Signout ?`,
      className: COMMON_VALUES.alertClass.danger,
      actionName: "Agree",
    });
  }, []);

  const cancelModalHandler = useCallback(() => {
    setShowModal(false);
    setShowBackDrop(false);
  }, []);

  const signoutHandler = useCallback(() => {
    logout();

    setShowModal(false);
    setShowBackDrop(false);
  }, [logout]);

  const fetchNotificationData = useCallback(async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/notification/notifi-summary";
    try {
      const res = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Loading notification data failed", null, COMMON_VALUES.alertClass.danger);

      if (res.latestNoti.length > 0) {
        setHasNewNotification(true);
      }
    } catch (error) {}
  }, [sendRequest, token]);

  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  return (
    <Fragment>
      <BackDrop isDisplayed={showBackDrop} />
      {showModal && <Modal data={modalData} onCancel={cancelModalHandler} onAction={signoutHandler} />}

      <header className="header">
        <nav className="header__home-icon">
          <div className="header__toggle-button" onClick={props.onClick}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Link to="/home">
            <img src={Home_Icon} alt="Home" />
          </Link>
        </nav>
        <nav className="header__shortcut">
          <Link to="/new-notifications">
            <img className={`${hasNewNotification ? "shining" : ""}`} src={Messenger_Icon} alt="New Notification" />
          </Link>
          <span className="header__signout">
            <img src={SIGNOUT_ICON} alt="Signout" onClick={showSignoutModalHandler} />
          </span>
        </nav>
      </header>
    </Fragment>
  );
};

export default Header;
