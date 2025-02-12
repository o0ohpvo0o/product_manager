import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./Login.css";
const Preview = (props) => {
  const { templateId } = useParams();
  const { sendRequest } = useHttpClient();
  const { token } = useContext(AuthContext);
  const [templateUrl, setTemplateUrl] = useState("");

  const fetchTemplates = useCallback(async () => {
    const url = process.env.REACT_APP_BACKEND_URL +`/settings/login-template/preview-template/${templateId}`;
    try {
      const res = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Preview template failed", null, COMMON_VALUES.alertClass.danger);

      setTemplateUrl(res.selectedTemplate.url);
    } catch (error) {
      console.log(error);
    }
  }, [sendRequest, token, templateId]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <Fragment>
      <div style={{ backgroundImage: `linear-gradient(to right, #4f4e4e, #535e5c, #eeb3b3), url(${templateUrl})`}} className="background"></div>
      <main className="authentication">
        <div className="main__login">
          <h1 className="login__title">ADMIN LOGIN</h1>
          <form className="form-login">
            <div className="form__controls">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" />
            </div>
            <div className="form__controls">
              <label htmlFor="username">Password</label>
              <input type="password" name="password" id="password" />
            </div>
            <div className="form__controls-button">
              <button type="button" className="button--submit">
                Login
              </button>
            </div>
            <div className="form__controls-notes">
              <span>Contact ICQ: 700589020 / Tele: j_tran_ggg</span>
            </div>
          </form>
        </div>
      </main>
    </Fragment>
  );
};

export default Preview;
