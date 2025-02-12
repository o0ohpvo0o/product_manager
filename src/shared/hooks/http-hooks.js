import { useCallback, useEffect, useRef, useState } from "react";

const useHttpClient = () => {
  const [alert, setAlert] = useState({
    message: "",
    className: "",
    showAlert: false,
  });
  const [showLoader, setShowLoader] = useState(false);
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = "GET", headers = {}, body = null, isShownLoader = false, alertMessage = null, successMessage = null, alertClass = null) => {
    if (isShownLoader) {
      setShowLoader(true);
    }

    let data;
    try {
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
        signal: httpAbortController.signal,
      });

      if (!response.ok) {
        if (alertMessage) {
          setAlert({
            message: alertMessage,
            className: "danger",
            showAlert: true,
          });
        }
      } else {
        if (successMessage) {
          setAlert({
            message: successMessage,
            className: "success",
            showAlert: true,
          });
        }
        data = await response.json();
      }

      setShowLoader(false);
      return data;
    } catch (error) {
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    if (alert.showAlert) {
      const timeOut = setTimeout(() => {
        setAlert((prev) => {
          return {
            ...prev,
            showAlert: false,
          };
        });
      }, 2000);

      return () => window.clearTimeout(timeOut);
    }
  }, [alert]);

  useEffect(() => {
    const abortCtrls = activeHttpRequests.current;
    return () => {
      abortCtrls.forEach((element) => element.abort());
    };
  }, []);

  const sendAlert = useCallback((alertMessage, alertClass) => {
    setAlert({
      message: alertMessage,
      className: alertClass,
      showAlert: true,
    });
  }, []);

  return {
    sendRequest,
    sendAlert,
    showLoader,
    alert,
  };
};

export default useHttpClient;
