import React from "react";
import "./SummaryCard.css";
const SummaryCard = React.memo(
  (props) => {
    const { summaryData } = props;
    return (
      <section>
        <ul className={`summary ${props.className ? props.className : ""}`}>
          {summaryData.map((item, index) => (
            <li key={index}>
              {item.name}
              {item.value}
            </li>
          ))}
        </ul>
      </section>
    );
  },
  (prevProps, nextProps) => prevProps.summaryData === nextProps.summaryData
);

export default SummaryCard;
