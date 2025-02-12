import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./CompanyMailFilterSettings.css";
const CompanyMailFilterSettings = (props) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const outputRef = useRef();
  const [output, setOutput] = useState();
  const { sendRequest, showLoader, alert, sendAlert } = useHttpClient();
  const { token } = useContext(AuthContext);

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const extractCompanyLeadsHandler = async () => {
    let mails = inputRef.current.value;
    const mailArr = mails.trim().split("\n");

    if (inputRef.current.value === "") return;

    const url = process.env.REACT_APP_BACKEND_URL +"/settings/mails/filter-company-mails";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ mails: mailArr}), true, "Check failed.", null, COMMON_VALUES.alertClass.danger);

      if (res.companyLeads.length === 0) return;

      let data = "";
      for (let index = 0; index < res.companyLeads.length; index++) {
        const email = res.companyLeads[index];
        data += `${email}\r\n`;
      }

      setOutput(data);
      sendAlert(`Extracted total ${res.companyLeads.length} company leads`, "success");

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const saveLeadsToFileHandler = () => {
    try {
      const blob = new Blob([output], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `Office_leads[${new Date(Date.now()).toLocaleString()}].txt`;
      link.href = downloadUrl;
      link.click();
    } catch (error) {}
  };

  const copyResultsHandler = () => {
    navigator.clipboard.writeText(output);

    sendAlert("Copied emails to clipboard.", "success");
  };

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
        Extract Company Leads
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea name="raw-html" id="raw" placeholder="Paste your mail list here...." rows="15" ref={inputRef}></textarea>
            </li>
            <li className="html__content--actions">
              <button className="html--encrypt" onClick={extractCompanyLeadsHandler}>
                Extract
              </button>
              <button className="html--save-encrypt" onClick={saveLeadsToFileHandler}>
                Save
              </button>
              <button className="html--save-encrypt" onClick={copyResultsHandler}>
                Copy Results
              </button>
            </li>
            <li className="html__content converted">
              <textarea name="converted-html" id="converted" placeholder="Result..." value={output} ref={outputRef} rows="15"></textarea>
            </li>
          </div>
        </ul>
      </li>
    </Fragment>
  );
};

export default CompanyMailFilterSettings;
