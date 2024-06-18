import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser, useGetRoles } from "../lib/react-query/queries";
import { toast } from "react-toastify";
import { use } from "i18next";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const {
    data,
    error,
    isError,
    isLoading: isLoadingUser,
  } = useGetCurrentUser(id, token);
  const isLoading = isLoadingRoles || isLoadingUser;

  const checkAuthUser = async () => {
    if (!isLoading && !isLoadingRoles) {
      if (data) {
        // localStorage.setItem("isAuthenticated", "true");
        setUser(data);
        setIsAuthenticated(true);
        const userRole: Irole | undefined =
          roles?.find((role: Irole) => role.id === data.role_id) || null;
        if (userRole) {
          setRole(userRole);
          setIsAdmin(userRole.is_admin);
        } else {
          setRole(null);
          setIsAdmin(null);
        }
      } else if (id && token && isError) {
        toast.error(t("auth.error", { message: error?.message }));
        // localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/auth/sign-in");
      } else if (id && token && !data) {
        // localStorage.removeItem("isAuthenticated");
        toast.error(t("auth.unkownError"));
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsAdmin(null);
        setRole(null);
        navigate("/auth/sign-in");
      } 
      else {
        // localStorage.removeItem("isAuthenticated");
        console.log("no data");
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsAdmin(null);
        setRole(null);
        // navigate("/auth/sign-in");
      }
    }
    // return isAuthenticated;
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      checkAuthUser();
    }
    return () => {
      isMounted = false;
    };
  }, [data, error, isError, isAuthenticated, roles, role]);

  //   useEffect(() => {
  // if (!isLoading) {
  // checkAuthUser();
  // }
  // const isAuthenticatedInStorage = localStorage.getItem("isAuthenticated") === "true";
  // setIsAuthenticated(isAuthenticatedInStorage);
  // setUserRole();
  //   }, [data, error, isError, isAuthenticated, roles, role]);

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
