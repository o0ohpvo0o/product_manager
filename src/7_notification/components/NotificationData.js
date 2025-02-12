import { Fragment } from "react";
import "./NotificationData.css";

const NotificationData = (props) => {
  let content = <h4>There no notification yet...</h4>;

  if (props.data.length > 0) {
    content = props.data.map((item, index) => (
      <li key={index} className="notification__item">
        <span className="date">{item.duration}</span>
        <p className="client-name">
          <strong className="noti-break">{item.type}: </strong> {item.content}
        </p>
      </li>
    ));
  }

  return <Fragment>{content}</Fragment>;
};

export default NotificationData;
