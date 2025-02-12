import { Fragment, useContext, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./PhoneVerificationSettings.css";

const PhoneVerificationSettings = (props) => {
  const [open, setOpen] = useState(false);
  // const [phone, setPhone] = useState();
  const phoneRef = useRef();
  const { alert, sendRequest, showLoader } = useHttpClient();
  const { token } = useContext(AuthContext);
  const [output, setOutput] = useState([]);

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const extractPhoneDataHandler = async () => {
    let phones = phoneRef.current.value;
    if (phones.trim() === "") return;
    const phoneArr = phones.trim().split("\n");
    if (phoneArr.length === 0) return;

    const url = process.env.REACT_APP_BACKEND_URL +"/settings/phone-number/extrac-data";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ numbers: phoneArr }), true, "Check failed.", null, COMMON_VALUES.alertClass.danger);

      if (res.phoneDatas.length > 0) {
        setOutput(res.phoneDatas);
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const savePhoneDatas = () => {
    let CsvString = `NUMBER,DIALLING,INTERNATIONAL,NATIONAL,TYPE,CARRIER,COUNTRY,REGION,CONTINENT,CAPITAL\r\n`;
    const validData = output.filter((x) => x.isValid);

    for (let index = 0; index < validData.length; index++) {
      const numberData = validData[index];
      CsvString += `${numberData.international.replace(" ", "")},${numberData.diallingCode},${numberData.international},${numberData.local},${numberData.type},${numberData.carrier},${numberData.country},${numberData.region},${numberData.continent},${numberData.capital}\r\n`;
    }

    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.setAttribute("download", "Number_data.csv");
    document.body.appendChild(x);
    x.click();
  };

  const saveValidNumbersHandler = () => {
    const validData = output.filter((x) => x.isValid);
    let result = "";
    validData.forEach((number) => {
      result += number.international + "\r\n";
    });
    const blob = new Blob([result], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `Valid_number[${new Date(Date.now()).toLocaleString()}].txt`;
    link.href = downloadUrl;
    link.click();
  };
  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          Check Phone Numbers
        </span>
        <ul className={`nested ${open ? "active nested__container" : ""}`}>
          <span className="separator"></span>
          <div className="html__container">
            <li className="html__content raw">
              <textarea name="raw-html" id="raw" placeholder="Paste your phone numbers here...." rows="15" ref={phoneRef}></textarea>
            </li>
            <li className="html__content--actions">
              <button className="html--encrypt" onClick={extractPhoneDataHandler}>
                Extract data
              </button>
              <button className="html--save-encrypt" onClick={savePhoneDatas}>
                Save data (.xls)
              </button>
              <button className="html--save-encrypt" onClick={saveValidNumbersHandler}>
                Save valid number
              </button>
            </li>
            <li className="html__content converted">
              <div className="converted-html" id="converted">
                {output.map((number, index) => {
                  if (number.isValid) {
                    return (
                      <p key={index}>
                        <span>{index + 1}.</span> <span className="phone-data">{number.international.replace(" ", "")}:</span>
                        <br />
                        <span className="phone-data-type">
                          Dialling: <span className="phone-data">{number.diallingCode}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          International: <span className="phone-data">{number.international}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          National: <span className="phone-data">{number.local}</span>{" "}
                        </span>
                        <br />
                        <span className="phone-data-type">
                          Type: <span className="phone-data">{number.type}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          Carrier: <span className="phone-data">{number.carrier || number.type}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          Country: <span className="phone-data">{number.country}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          City: <span className="phone-data">{number.city || number.country}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          Region: <span className="phone-data">{number.region}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          Continent: <span className="phone-data">{number.continent}</span>
                        </span>
                        <br />
                        <span className="phone-data-type">
                          Capital: <span className="phone-data">{number.capital}</span>
                        </span>
                        <br />
                      </p>
                    );
                  } else {
                    return (
                      <p key={index}>
                        <span>{index + 1}.</span> <span className="error-phone">{number.local}: Invalid Phone Number/Format</span>
                        <br />
                      </p>
                    );
                  }
                })}
              </div>
            </li>
          </div>
        </ul>
      </li>
    </Fragment>
  );
};

export default PhoneVerificationSettings;
