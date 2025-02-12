import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import BackDrop from "../../shared/components/LayerComponents/BackDrop";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import { TblContext } from "../../shared/contexts/table-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import NotificationData from "../components/NotificationData";
import "./Notification.css";

const Notification = (props) => {
  const [showBackDrop, setShowBackDrop] = useState(true);
  const { token } = useContext(AuthContext);
  const { sendRequest, showLoader } = useHttpClient();
  const [notification, setNotification] = useState([]);
  const { itemsData, setItemsData } = useContext(TblContext);

  const fetchNotifications = useCallback(async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/notification/notifi-summary";
    try {
      let notificationData;
      if (!itemsData || itemsData.length === 0 ) {
        const res = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Loading results data failed", COMMON_VALUES.alertClass.danger);

        setItemsData(res.allData);
        notificationData = res.latestNoti;
      } else {
        notificationData = itemsData.filter((x) => (Date.now() - new Date(x.added)) / 86400000 < 1);
      }

      let arrRes = [];
      if (notificationData) {
        notificationData.forEach((item) => {
          const totalMiliseconds = new Date().getTime() - new Date(item.added).getTime();

          const rawDurationHours = totalMiliseconds / 3600000;
          const durationHours = Math.floor(rawDurationHours);
          let minsLeft = 0;
          if (rawDurationHours > 1) {
            minsLeft = Math.ceil((rawDurationHours - Math.floor(rawDurationHours)) * 60);
          }

          const durationMins = Math.ceil(totalMiliseconds / 60000);

          let duration = durationMins < 1 ? "Near a minute ago" : `Near ${durationMins} minute(s) ago`;
          duration = durationHours >= 1 ? `Near ${durationHours}h ${minsLeft} min(s) ago` : duration;

          let content = `${item.item || `unknown`}`;

          arrRes.push({
            type: item.type,
            duration: duration,
            content: content,
          });
        });

        setNotification(arrRes);
      }
    } catch (error) {}
    setShowBackDrop(false);
  }, [token, sendRequest, itemsData, setItemsData]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Fragment>
      <BackDrop isDisplayed={showBackDrop} />
      {showLoader && <Loader />}
      <main>
        <section className="main__notification">
          <ul className="notification__items">{!showBackDrop && !showLoader && <NotificationData data={notification} />}</ul>
        </section>
      </main>
    </Fragment>
  );
};

export default Notification;
