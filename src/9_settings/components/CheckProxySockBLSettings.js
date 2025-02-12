import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./CheckProxySockBLSettings.css";

const CheckProxySocksBLSettings = (props) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();

  const [output, setOutput] = useState([]);
  const [whitelist, setWhitelists] = useState([]);

  const { alert, sendRequest, showLoader, sendAlert } = useHttpClient();
  const { token } = useContext(AuthContext);

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const checkBlacklistIpsHandler = async () => {
    let ips = inputRef.current.value;
    const ipArr = ips.trim().split("\n");
    const url = process.env.REACT_APP_BACKEND_URL + "/settings/blacklist/check-ip";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ ips: ipArr }), true, "Check failed.", null, COMMON_VALUES.alertClass.danger);

      setOutput(res.blResults);
      if (res.whiteLists.length > 0) {
        setWhitelists(res.whiteLists.join("\r\n"));
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const saveWhiteListHandler = () => {
    try {
      const blob = new Blob([whitelist], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `Clean-ip[${new Date(Date.now()).toLocaleString()}].txt`;
      link.href = downloadUrl;
      link.click();
    } catch (error) {}
  };

  const copyWhiteListHandler = async () => {
    navigator.clipboard.writeText(whitelist);

    sendAlert("Copied clean proxy to clipboard.", "success");
  };

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />
      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          Check Proxy/Socks/SSH... Blacklist
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea className="raw-html" id="raw" placeholder="Paste your IP(s) list...." rows="15" ref={inputRef}></textarea>
            </li>
            <li className="html__content--actions">
              <button className="html--encrypt" onClick={checkBlacklistIpsHandler}>
                Check BL
              </button>
              <button className="html--save-encrypt" onClick={saveWhiteListHandler}>
                Save Whitelist
              </button>
              <button className="html--save-encrypt" onClick={copyWhiteListHandler}>
                Copy Whitelist
              </button>
            </li>
            <li className="html__content converted">
              <div className="converted-html check-bl-ip" id="converted">
                {output.map((element, index) => (
                  <p key={index}>
                    <span>{index + 1}.</span> <span className="ip-address">{element.ip} =&gt; </span>
                    <span className={`${element.reportedCount > 0 ? "bl-ip" : "clean-ip"}`}>{element.reportedCount > 0 ? `Blacklisted (${element.reportedCount} logs)` : "Clean"}</span>
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

export default CheckProxySocksBLSettings;
