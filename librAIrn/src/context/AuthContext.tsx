import { createContext, useState, ReactNode, useContext } from "react";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  const login = (user: User, token: string) => {
    setAuth({ user, token });
    // 인증 토큰 저장 로직 (예: localStorage에도 저장)
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("token");
  };

  const updateUser = (user: User) => {
    setAuth((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
