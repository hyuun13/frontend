import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";

interface Toast {
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToastContext는 ToastProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // showToast 함수를 useCallback으로 메모이제이션
  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      const newToast: Toast = { message, type };
      setToasts((prevToasts) => [...prevToasts, newToast]);

      // 3초 후 자동으로 제거
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
