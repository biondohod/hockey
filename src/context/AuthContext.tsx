import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "../lib/react-query/queries";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const INITIAL_STATE = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const id = localStorage.getItem("id") || null;
  const token = localStorage.getItem("token") || null;
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const { data, error, isError } = useGetUser(id, token);

  const checkAuthUser = async () => {
    if (id && token) {
      setIsLoading(true);
      if (isError) {
        toast.error(
          `Ошибка при получении данных пользователя: ${error?.message}`
        );
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate("/auth/sign-in");
      } else {
        setUser(data);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
    return isAuthenticated;
  };

  useEffect(() => {
    checkAuthUser();
  }, [data, error, isError, isAuthenticated]);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
