import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import "./Login.css";

const Login = (props) => {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const { alert, sendRequest, sendAlert, showLoader } = useHttpClient();
  const { login } = useContext(AuthContext);
  const [template, setTemplate] = useState("");

  const sendLoginHandler = async (e) => {
    e.preventDefault();
    const username = userNameRef.current.value;
    const password = passwordRef.current.value;

    if (username.trim() === "" || password.trim() === "") {
      sendAlert("Enter username & password", COMMON_VALUES.alertClass.danger);
    } else {
      const url = process.env.REACT_APP_BACKEND_URL + "/user/sign-in";
      try {
        const body = JSON.stringify({
          email: username,
          password: password,
        });

        const res = await sendRequest(url, "POST", { "Content-type": "application/json" }, body, true, "Login failed", COMMON_VALUES.alertClass.danger);

        login(res.userId, res.token);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchLoginTemplate = async () => {
      const url = process.env.REACT_APP_BACKEND_URL + `/settings/login-template/selected-template`;
      try {
        const res = await sendRequest(url, "GET", { "Content-Type": "application/json" }, null, true, "Loading template failed", null, COMMON_VALUES.alertClass.danger);

        setTemplate(res.selectedTemplate.url);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLoginTemplate();
  }, [sendRequest]);

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <div style={{ backgroundImage: `linear-gradient(to right, #4f4e4e, #535e5c, #eeb3b3), url(${template})` }} className="background"></div>
      <main className="authentication">
        <div className="main__login">
          <h1 className="login__title">ADMIN LOGIN</h1>
          <form className="form-login" onSubmit={sendLoginHandler}>
            <div className="form__controls">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" ref={userNameRef} />
            </div>
            <div className="form__controls">
              <label htmlFor="username">Password</label>
              <input type="password" name="password" id="password" ref={passwordRef} />
            </div>
            <div className="form__controls-button">
              <button type="submit" className="button--submit">
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

export default Login;
