import { createContext, useState, useEffect, useContext } from "react";
import { toastTimeout } from "../utils";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toastMessage, setToastMessage] = useState(null);

  let timer;

  useEffect(() => {
    if (toastMessage) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setToastMessage(null);
      }, toastTimeout);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [toastMessage]);

  return (
    <ToastContext.Provider value={{ toastMessage, setToastMessage }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
