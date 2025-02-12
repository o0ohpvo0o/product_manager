import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./MailFetcherSettings.css";
const MailFetcherSettings = (props) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const outputRef = useRef();
  const delimiterRef = useRef();
  const [output, setOutput] = useState();
  const [validAccounts, setValidAccounts] = useState([]);

  const { sendRequest, showLoader, alert, sendAlert } = useHttpClient();
  const { token } = useContext(AuthContext);

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const fetchMailListHandler = async () => {
    let combos = inputRef.current.value;
    let delimiter = delimiterRef.current.value;
    const mailArr = combos.trim().split("\n");

    if (inputRef.current.value === "" || delimiter === "") return;

    const url = process.env.REACT_APP_BACKEND_URL +"/settings/mails/fetch-mails";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ mails: mailArr, delimiter: delimiter }), true, "Check failed.", null, COMMON_VALUES.alertClass.danger);

      if (res.mailList.length === 0) return;

      let data = "";
      for (let index = 0; index < res.mailList.length; index++) {
        const email = res.mailList[index];
        data += `${email}\r\n`;
      }

      setOutput(data);
      setValidAccounts(res.validAccounts);
      sendAlert(`Fetched total ${res.mailList.length} emails`, "success");

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

  const copyValidAccountsHandler = () => {
    navigator.clipboard.writeText(validAccounts.join("\r\n"));
    sendAlert("Copied valid accounts to clipboard.", "success");
  };
  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
        Fetch All Office MailFrom/To/CC Emails
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea name="raw-html" id="raw" placeholder="Paste your mail list here...." rows="15" ref={inputRef}></textarea>
            </li>
            <li className="html__content--actions">
              <input className="mail-delimiter" type="text" name="delimiter" ref={delimiterRef} placeholder="split..." />
              <button className="html--encrypt" onClick={fetchMailListHandler}>
                Fetch
              </button>
              <button className="html--save-encrypt" onClick={saveLeadsToFileHandler}>
                Save
              </button>
              <button className="html--save-encrypt" onClick={copyResultsHandler}>
                Copy Results
              </button>
              <button className="html--save-encrypt" onClick={copyValidAccountsHandler}>
                Valid Accounts
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

export default MailFetcherSettings;
