import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
const EncryptLetterSettings = (props) => {
  const [open, setOpen] = useState(false);
  const [encrypted, setEncrypted] = useState();
  const [title, setTitle] = useState();
  const { alert, sendRequest } = useHttpClient();
  const { token } = useContext(AuthContext);
  const letterRef = useRef();

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const encryptAllLetterHandler = async () => {
    const doc = new DOMParser().parseFromString(letterRef.current.value, "text/html");
    // const HTMLArray = [...doc.body.children].map((el) => el.outerHTML);
    const title = doc.title;
    if (title) {
      setTitle(title);
    }

    if (!doc.body.innerText) {
      return;
    }

    let encrytedHtml = letterRef.current.value;
    let breakAll = encrytedHtml.split(">");
    let groupInlineTags = [];
    for (let index = 0; index < breakAll.length; index++) {
      try {
        const element = breakAll[index];
        const inTag = element.split("<")[1];
        groupInlineTags.push(inTag);
      } catch (error) {
        continue;
      }
    }

    let compare = "";
    if (groupInlineTags.length > 0) {
      compare = groupInlineTags.join(",");
    }

    const url = process.env.REACT_APP_BACKEND_URL + "/settings/letter/encrypt-all";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ words: doc.body.innerText }), true, "Encrypt failed.", null, COMMON_VALUES.alertClass.danger);

      console.log(res);
      if (res.wordEncrypted) {
        for (let index = 0; index < res.wordEncrypted.length; index++) {
          try {
            const element = res.wordEncrypted[index];
            if (compare.includes(element.key)) continue;

            encrytedHtml = encrytedHtml.replaceAll(new RegExp(`\\b${element.key}\\b`, "g"), element.value);
          } catch (error) {
            continue;
          }
        }
      }

      setEncrypted(encrytedHtml);
    } catch (error) {
      console.log(error);
    }
  };

  const encryptSensitiveHandler = async () => {
    const doc = new DOMParser().parseFromString(letterRef.current.value, "text/html");
    // const HTMLArray = [...doc.body.children].map((el) => el.outerHTML);
    const title = doc.title;
    if (title) {
      setTitle(title);
    }

    if (!doc.body.innerText) {
      return;
    }

    let encrytedHtml = letterRef.current.value;
    const url = process.env.REACT_APP_BACKEND_URL + "/settings/letter/encrypt-sensitive";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ words: doc.body.innerText }), true, "Encrypt failed.", null, COMMON_VALUES.alertClass.danger);

      console.log(res);
      if (res.wordEncrypted) {
        res.wordEncrypted.forEach((element) => {
          encrytedHtml = encrytedHtml.replaceAll(new RegExp(`\\b${element.key}\\b`, "g"), element.value);
        });
      }

      setEncrypted(encrytedHtml);
    } catch (error) {
      console.log(error);
    }
  };

  const saveEncryptedhandler = () => {
    if (!encrypted) {
      return;
    }

    const blob = new Blob([encrypted], { type: "text/html" });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `${title} [ENCRYPTED].html` || `ENCRYPTED [${new Date(Date.now()).toLocaleDateString()}].html`;
    link.href = downloadUrl;
    link.click();
  };
  return (
    <Fragment>
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          Encrypt Letter
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea name="raw-html" id="raw" placeholder="Paste your html...." rows="30" ref={letterRef}></textarea>
            </li>
            <li className="html__content--actions">
              <button type="button" onClick={encryptAllLetterHandler} className="html--encrypt">
                Encrypt all
              </button>
              <button type="button" onClick={encryptSensitiveHandler} className="html--encrypt">
                Encrypt sensitive cases
              </button>
              <button className="html--save-encrypt" onClick={saveEncryptedhandler}>
                Save
              </button>
            </li>
            <li className="html__content converted">
              <textarea name="converted-html" id="converted" placeholder="Encrypted html..." rows="30" value={encrypted}></textarea>
            </li>
          </div>
        </ul>
      </li>
    </Fragment>
  );
};

export default EncryptLetterSettings;
