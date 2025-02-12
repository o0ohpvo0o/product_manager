import React, { Fragment, Suspense, useContext, useEffect, useState } from "react";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
// import Layout from "./0_layout/Layout";
// import Home from "./1_home/pages/Home";
// import Login from "./5_login/pages/Login";
// import Preview from "./5_login/pages/Preview";
// import Notification from "./7_notification/pages/Notification";
// import Others from "./8_others/pages/Others";
// import Settings from "./9_settings/pages/Settings";
import Loader from "./shared/components/UIComponents/Loader";
import { AuthContext } from "./shared/contexts/auth-context";
import TblContextProvider from "./shared/contexts/table-context";

const Layout = React.lazy(() => import("./0_layout/Layout"));
const Login = React.lazy(() => import("./5_login/pages/Login"));
const Settings = React.lazy(() => import("./9_settings/pages/Settings"));
const Others = React.lazy(() => import("./8_others/pages/Others"));
const Preview = React.lazy(() => import("./5_login/pages/Preview"));
const Notification = React.lazy(() => import("./7_notification/pages/Notification"));
const Home = React.lazy(() => import("./1_home/pages/Home"));

function App() {
  const { token, login } = useContext(AuthContext);
  const [hasInitVal, setHasInitVal] = useState(false);

  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("userData"));
    if (userToken && userToken.userId && userToken.token && new Date(userToken.expiration) > new Date()) {
      login(userToken.userId, userToken.token, userToken.expiration);
    }
    setHasInitVal(true);
  }, [login]);

  return (
    <Fragment>
      {!hasInitVal && <Loader />}
      {!token && hasInitVal && (
        <Router>
          <Suspense
            fallback={
              <div>
                <Loader />
              </div>
            }
          >
            <Routes>
              <Route path="/sign-in" element={<Login />} />
              <Route path="*" element={<Navigate to="/sign-in" />} />
            </Routes>
          </Suspense>
        </Router>
      )}

      {token && hasInitVal && (
        <Router>
          <Suspense
            fallback={
              <div>
                <Loader />
              </div>
            }
          >
            <Routes>
              <Route
                path="/home"
                element={
                  <TblContextProvider>
                    <Layout>
                      <Home />
                    </Layout>
                  </TblContextProvider>
                }
              />

              <Route
                path="/others-manager"
                element={
                  <TblContextProvider>
                    <Layout>
                      <Others />
                    </Layout>
                  </TblContextProvider>
                }
              />

              <Route
                path="/settings"
                element={
                  <TblContextProvider>
                    <Layout>
                      <Settings />
                    </Layout>
                  </TblContextProvider>
                }
              />

              <Route path="/preview/:templateId" element={<Preview />} />
              <Route
                path="/new-notifications"
                element={
                  <TblContextProvider>
                    <Layout>
                      <Notification />
                    </Layout>
                  </TblContextProvider>
                }
              />
              <Route path="*" element={<Navigate to="/others-manager" />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </Fragment>
  );
}

export default App;
