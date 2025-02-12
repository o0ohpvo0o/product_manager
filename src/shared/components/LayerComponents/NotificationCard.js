import React from "react";
import "./NotificationCard.css";
const NotificationCard = React.memo(
  (props) => {
    return (
      <section className={`header-card ${props.className}`}>
        <span>
          <img src={props.image} alt={props.imageName} />
          <h3>{props.content}</h3>
        </span>
        {props.subContent}
      </section>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps
);

export default NotificationCard;
