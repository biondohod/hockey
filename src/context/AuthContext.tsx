import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser, useGetRoles } from "../lib/react-query/queries";
import { toast } from "react-toastify";

const INITIAL_STATE = {
  user: null,
  isAuthenticated: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: () => {},
  isAdmin: null,
  isLoading: false,
  role: null,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const id = localStorage.getItem("id") || null;
  const token = localStorage.getItem("token") || null;
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [role, setRole] = useState<Irole | null>(null);
  const navigate = useNavigate();

  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const {
    data,
    error,
    isError,
    isLoading: isLoadingUser,
  } = useGetCurrentUser(id, token);
  const isLoading = isLoadingRoles || isLoadingUser;

  const checkAuthUser = async () => {
    if (!isLoading) {
      if (isError || (!data)) {
        toast.error(
          `Ошибка при получении данных пользователя: ${error?.message}`
        );
        // localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/auth/sign-in");
      } else if (data) {
        // localStorage.setItem("isAuthenticated", "true");
        setUser(data);
        setIsAuthenticated(true);
        setRole(roles?.find((role: Irole) => role.id === data.role_id));
        setIsAdmin(data.role_id === 1);
      }
    }
    // return isAuthenticated;
  };

  useEffect(() => {
    if (!isLoading) {
      checkAuthUser();
    }
    // const isAuthenticatedInStorage = localStorage.getItem("isAuthenticated") === "true";
    // setIsAuthenticated(isAuthenticatedInStorage);
    // setUserRole();
  }, [data, error, isError, isAuthenticated, roles, role]);

  // const setUserRole = () => {
  //     if (user) {
  //         const role_id = user.role_id;
  //         const userRole = roles?.find((role: Irole) => role.id === role_id);
  //         setRole(userRole);
  //     }
  // }

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    role,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
