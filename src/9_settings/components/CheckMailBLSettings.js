import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./CheckMailBLSettings.css";

const CheckMailBLSettings = (props) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const [output, setOutput] = useState([]);
  const [blList, setBlList] = useState();
  const [whitelist, setWhitelists] = useState([]);

  const { alert, sendRequest, showLoader, sendAlert } = useHttpClient();
  const { token } = useContext(AuthContext);

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const checkBlacklistEmailHandler = async () => {
    let emails = inputRef.current.value;
    const mailArr = emails.trim().split("\n");
    const url = process.env.REACT_APP_BACKEND_URL +"/settings/blacklist/check-email";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ emails: mailArr }), true, "Check failed.", null, COMMON_VALUES.alertClass.danger);

      let response = "";
      setOutput(res.blResults);

      for (let index = 0; index < res.blResults.length; index++) {
        const element = res.blResults[index];

        response += `'${element.email}' listed at: [${element.reportedSites?.join(" , ")}] - [${element.reportedCount} BL database(s)]\n\n`;
      }

      setBlList(response);
      setWhitelists(res.whiteLists.join("\r\n"));

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const saveBLResultsHandler = () => {
    try {
      const blob = new Blob([blList], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `Whitelist_rs[${new Date(Date.now()).toLocaleString()}].txt`;
      link.href = downloadUrl;
      link.click();
    } catch (error) {}
  };

  const saveWhiteListHandler = () => {
    try {
      const blob = new Blob([whitelist], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `BL_rs[${new Date(Date.now()).toLocaleString()}].txt`;
      link.href = downloadUrl;
      link.click();
    } catch (error) {}
  };

  const copyWhiteListHandler = async () => {
    navigator.clipboard.writeText(whitelist);

    sendAlert("Copied whitelist emails to clipboard.", "success");
  };

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />
      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          Check Mails/MailFrom Blacklist Records
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea className="raw-html" id="raw" placeholder="Paste your mail list...." rows="15" ref={inputRef}></textarea>
            </li>
            <li className="html__content--actions">
              <button className="html--encrypt" onClick={checkBlacklistEmailHandler}>
                Check BL
              </button>
              <button className="html--save-encrypt" onClick={saveBLResultsHandler}>
                Save BL
              </button>
              <button className="html--save-encrypt" onClick={saveWhiteListHandler}>
                Save Whitelist
              </button>
              <button className="html--save-encrypt" onClick={copyWhiteListHandler}>
                Copy Whitelist
              </button>
            </li>
            <li className="html__content converted">
              <div className="converted-html" id="converted">
                {output.map((element, index) => (
                  <p key={element.email}>
                    <span>{index + 1}.</span> <span className="email-address">{element.email}</span> listed at: <br /> <span className="bl-site">[{element.reportedSites.join(" , ")}]</span> - [<span>{element.reportedCount} BL database(s)</span>]
                  </p>
                ))}
              </div>
              {/* <textarea name="converted-html" id="converted" ref={outputRef} value={output} placeholder="Results..." rows="15"></textarea> */}
            </li>
          </div>
        </ul>
      </li>
    </Fragment>
  );
};

export default CheckMailBLSettings;
