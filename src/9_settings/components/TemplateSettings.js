import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";

const TemplateSettings = (props) => {
  const [open, setOpen] = useState(false);
  const { alert, sendRequest } = useHttpClient();
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const urlRef = useRef();

  const switchSettingHandler = () => {
    setOpen((prev) => !prev);
  };

  const addNewTemplateHandler = async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/settings/login-template";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ url: urlRef.current.value }), true, "Add new template failed. Template must be unique", "Added new template", COMMON_VALUES.alertClass.danger);

      if (res.template) {
        fetchTemplates();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const previewTemplate = (id) => {
    const url = `${process.env.REACT_APP_PUBLIC_URL}/#/preview/${id}`;
    window.open(url, "_blank");
  };

  const setTemplateHandler = async (id) => {
    const url = process.env.REACT_APP_BACKEND_URL + "/settings/login-template/save-template";
    try {
      const res = await sendRequest(url, "POST", { "Content-Type": "application/json", Authorization: "Bearer " + token }, JSON.stringify({ id }), true, "Save template failed", "Set template sucessfully", null, COMMON_VALUES.alertClass.danger);

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const removeTemplateHandler = async (id) => {
    const url = process.env.REACT_APP_BACKEND_URL + `/settings/login-template/${id}`;
    try {
      await sendRequest(url, "DELETE", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Delete template failed", "Template deleted", null, COMMON_VALUES.alertClass.danger);

      await fetchTemplates();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTemplates = useCallback(async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/settings/login-template/get-all";
    try {
      const res = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Loading template data failed", null, COMMON_VALUES.alertClass.danger);

      if (res) {
        setData((prev) => {
          return res.templates;
        });
      }
    } catch (error) {}
  }, [sendRequest, token]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);
  
  return (
    <Fragment>
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />
      <li>
        <span onClick={switchSettingHandler} className={`caret ${open ? "caret-down" : ""}`}>
          Change Login Template
        </span>
        <ul className={`nested ${open ? "active settings__items" : ""}`}>
          <span className="separator"></span>
          <div className="block__new-pic">
            <input type="text" placeholder="URL address..." className="new-pic" ref={urlRef} />
            <button onClick={addNewTemplateHandler} type="button">
              Add new
            </button>
          </div>
          <table className="table__template">
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.url}</td>
                  <td>
                    <button type="button" onClick={previewTemplate.bind(null, item.id)} className="preview-pic">
                      Preview
                    </button>
                    <button type="button" onClick={setTemplateHandler.bind(null, item.id)} className="set-pic">
                      Set Template
                    </button>
                    <button type="button" onClick={removeTemplateHandler.bind(null, item.id)} className="remove-pic">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ul>
      </li>
    </Fragment>
  );
};

export default TemplateSettings;
