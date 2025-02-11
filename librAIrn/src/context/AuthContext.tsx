import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { userLoginService } from "../services/userService";
import { User } from "../types/user";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 로그인 상태 유지
    }
  }, []);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      const result = await userLoginService({
        userLoginId: loginId,
        userPassword: password,
      });
      if (result) {
        const loggedInUser: User = {
          id: result.userId,
          name: result.userName,
          status: "",
        };
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
