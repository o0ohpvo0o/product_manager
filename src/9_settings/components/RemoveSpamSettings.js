import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";

const RemoveSpamSettings = (props) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const outputRef = useRef();
  const [output, setOutput] = useState();
  const [result, setResult] = useState([]);

  const { sendRequest, showLoader, alert, sendAlert } = useHttpClient();
  const { token } = useContext(AuthContext);

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const removeSpamMailHandler = async () => {
    let inputContent = inputRef.current.value;
    const mailArr = inputContent.trim().split("\n");

    if (inputRef.current.value === "") return;

    const url = process.env.REACT_APP_BACKEND_URL + "/settings/mails/remove-spam";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ mails: mailArr }), true, "Check failed.", null, COMMON_VALUES.alertClass.danger);

      if (res.validMails.length === 0) return;

      setResult(res);
      let data = "";
      for (let index = 0; index < res.validMails.length; index++) {
        const email = res.validMails[index];
        data += `${email}\r\n`;
      }

      setOutput(data);
      sendAlert(`Extracted ${res.validMails.length}/${mailArr.length} valid emails`, "success");

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
      link.download = `Valid_Leads[${new Date(Date.now()).toLocaleString()}].txt`;
      link.href = downloadUrl;
      link.click();
    } catch (error) {}
  };

  const copyResultsHandler = () => {
    navigator.clipboard.writeText(output);

    sendAlert("Copied valid emails to clipboard.", "success");
  };

  const makeReportHandler = () => {
    let CsvString = `VALID,NO_REPLY,SPAM_TRAP,INVALID,DISPOSABLE\r\n`;
    if (result.length === 0) return;
    const VALID = result.validMails;
    const NO_REPLY = result.invalids.noReply;
    const SPAM_TRAP = result.invalids.spam;
    const INVALID = result.invalids.invalid;
    const DISPOSABLE = result.invalids.disposable;

    const array = [VALID.length, NO_REPLY.length, SPAM_TRAP.length, INVALID.length, DISPOSABLE.length];
    var largest = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] > largest) {
        largest = array[i];
      }
    }

    for (let index = 0; index < largest; index++) {
      CsvString += `${VALID[index] || ""},${NO_REPLY[index] || ""},${SPAM_TRAP[index] || ""},${INVALID[index] || ""},${DISPOSABLE[index] || ""}\r\n`;
    }

    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.setAttribute("download", "report_data.csv");
    document.body.appendChild(x);
    x.click();
  };

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          Remove SpamTrap/Dead/Invalid/Disposable/NoReply Email
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea name="raw-html" id="raw" placeholder="Paste your mail list here...." rows="15" ref={inputRef}></textarea>
            </li>
            <li className="html__content--actions">
              <button className="html--encrypt" onClick={removeSpamMailHandler}>
                Remove
              </button>
              <button className="html--save-encrypt" onClick={saveLeadsToFileHandler}>
                Save Results
              </button>
              <button className="html--save-encrypt" onClick={copyResultsHandler}>
                Copy
              </button>
              <button className="html--save-encrypt" onClick={makeReportHandler}>
                Make Report
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

export default RemoveSpamSettings;
