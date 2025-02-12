import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";

const GeneralSettings = (props) => {
  const { alert, sendRequest, showLoader } = useHttpClient();
  const { token } = useContext(AuthContext);

  const [open, setOpen] = useState(true);
  const timeZoneRef = useRef();
  const phoneKeyRef = useRef();
  const pwdKeyRef = useRef();
  const [isPwdShown, setIsPwdShown] = useState(false);

  const [settings, setSettings] = useState({
    running: "",
    timezone: "",
    pwdExtraKey: "",
    phoneKey: "",
  });

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const getTimezoneHandler = (props) => {
    const timeZoneVal = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSettings((prev) => {
      return {
        ...prev,
        timezone: timeZoneVal,
      };
    });
  };

  const setTimezoneHandler = (e) => {
    setSettings((prev) => {
      return {
        ...prev,
        timezone: e.target.value,
      };
    });
  };

  const pwdKeyChangeHandler = (e) => {
    setSettings((prev) => {
      return {
        ...prev,
        pwdExtraKey: e.target.value,
      };
    });
  };

  const fetchSettings = useCallback(async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/settings/general-settings";
    try {
      const res = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Loading settings data failed", null, COMMON_VALUES.alertClass.danger);

      if (res) {
        setSettings((prev) => {
          return {
            phoneKey: res?.phoneKey || "",
            pwdExtraKey: res?.pwdExtraKey || "",
            running: res?.running || "",
            timezone: res?.timezone || "",
          };
        });
      }
    } catch (error) {}
  }, [sendRequest, token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettingsHandler = async (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_BACKEND_URL + "/settings";
    const body = {
      phoneKey: phoneKeyRef.current.value,
      pwdExtrakey: pwdKeyRef.current.value,
      timezone: timeZoneRef.current.value,
    };

    try {
      await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify(body), true, "Save settings failed", "Save settings successfully", COMMON_VALUES.alertClass.success);
    } catch (error) {
      console.log(error);
    }
  };

  const showHidePwdhandler = () => {
    setIsPwdShown((prev) => !prev);
  };

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          General
        </span>
        <form onSubmit={saveSettingsHandler}>
          <ul className={`nested ${open ? "active nested__container" : ""}`}>
            <span className="separator"></span>
            <li className="block timezone">
              <label htmlFor="time-zone">Running</label>
              <input type="text" readOnly placeholder="0 days..." value={settings.running} />
            </li>

            <li className="block timezone">
              <label htmlFor="time-zone">Time zone</label>
              <div style={{ width: "100%" }}>
                <input type="text" placeholder="Time zone..." ref={timeZoneRef} value={settings.timezone} onChange={setTimezoneHandler} />
                <button className="auto-timezone" type="button" onClick={getTimezoneHandler}>
                  Get Timezone
                </button>
              </div>
            </li>

            <li className="block password-key">
              <label htmlFor="password-key">Pwd extra key</label>
              <div style={{ width: "100%" }}>
                <input type={isPwdShown ? "text" : "password"} placeholder="Secret key..." value={settings.pwdExtraKey} ref={pwdKeyRef} onChange={pwdKeyChangeHandler} />
                <button className="auto-timezone" type="button" onClick={showHidePwdhandler}>
                  Show/hide
                </button>
              </div>
            </li>

            {/* <li className="block phone-key">
              <label htmlFor="password-key">Phone Checker Key</label>
              <div style={{ width: "100%" }}>
                <input type={isPhoneKeyShown ? "text" : "password"} value={settings.phoneKey} onChange={phoneKeyChangeHandler} ref={phoneKeyRef} placeholder="Secret key..." />
                <button className="auto-timezone" type="button" onClick={showHidePhoneKeyhandler}>
                  Show/hide
                </button>
              </div>
            </li> */}
            <li className="block save">
              <button className="general__settings--save" type="submit">
                Save
              </button>
            </li>
          </ul>
        </form>
      </li>
    </Fragment>
  );
};

export default GeneralSettings;
