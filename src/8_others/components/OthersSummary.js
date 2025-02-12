import React, { Fragment, useRef } from "react";
import "../../common_css/LeadsSummary.css";

const OthersSummary = React.memo(
  (props) => {
    const fromDateRef = useRef();
    const toDateRef = useRef();
    const typeRef = useRef();
    const { durationData } = props;

    const saveDataToFileHandler = () => {
      const fDate = fromDateRef.current.value ? fromDateRef.current.value : undefined;
      const tDate = fromDateRef.current.value ? toDateRef.current.value : undefined;
      const type = typeRef.current.value ? typeRef.current.value : undefined;

      props.onDownload(fDate, tDate, type);
    };

    return (
      <Fragment>
        <div className="finalize">
          <table className="extract">
            <thead>
              <tr>
                <th>Duration</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {durationData.map((item) => (
                <tr key={item.duration}>
                  <td>{item.duration}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="finalize__options">
            <div>
              From <input type="date" ref={fromDateRef} /> to <input type="date" ref={toDateRef} />
            </div>
            <div>
              Type: <input type="text" placeholder="Type..." ref={typeRef} />
            </div>
            <div>
              <button className="btn-download" onClick={saveDataToFileHandler}>
                Download
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  },
  (prevProps, nextProps) => prevProps.durationData === nextProps.durationData
);

export default OthersSummary;
