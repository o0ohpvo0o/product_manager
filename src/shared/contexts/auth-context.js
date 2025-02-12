import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext({
  token: null,
  userId: null,
  isLoggedIn: false,
  login: (userId, token) => {},
  logout: () => {},
});

let timer;

const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState(null);
  const [tokenExpDate, setTokenExpDate] = useState();
  const [token, setToken] = useState(null);

  const loginUserHandler = useCallback((userId, token, expiration) => {
    setUserId(userId);
    setToken(token);
    const expirationDate = expiration || new Date().getTime() + 1000 * 60 * 60;
    setTokenExpDate(expirationDate);
    localStorage.setItem("userData", JSON.stringify({ userId: userId, token: token, expiration: expirationDate }));
  }, []);

  const logoutUserHandler = useCallback(() => {
    setUserId(null);
    setToken(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const timeLeft = tokenExpDate - new Date().getTime();
      timer = setTimeout(() => {
        logoutUserHandler();
      }, timeLeft);
    } else {
      clearTimeout(timer);
    }
  }, [token, tokenExpDate, logoutUserHandler]);

  const initialValues = {
    userId: userId,
    token: token,
    isLoggedIn: !!token,
    login: loginUserHandler,
    logout: logoutUserHandler,
  };

  return <AuthContext.Provider value={initialValues}>{props.children}</AuthContext.Provider>;
};

export default AuthContextProvider;
