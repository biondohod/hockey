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
  const { data: roles, isLoading: isLoadingRoles, isError: isErrorRoles, refetch } = useGetRoles();
  const {
    data,
    error,
    isError,
    isLoading: isLoadingUser,
  } = useGetCurrentUser(id, token);
  const isLoading = isLoadingRoles || isLoadingUser;

  const checkAuthUser = async () => {
    if (!isLoading) {
      if (data && roles) {
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

  // useEffect(() => {
  //   let isMounted = true;
  //   if (isMounted) {
  //     checkAuthUser();
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [data, error, isError, isAuthenticated, roles, role, isLoading]);

  useEffect(() => {
    // Этот useEffect отвечает за проверку пользователя после загрузки всех необходимых данных
    if (!isLoadingUser && !isLoadingRoles && roles && data && isAuthenticated) {
      checkAuthUser();
    } else if (!isLoadingUser && !isLoadingRoles && !isAuthenticated) {
      checkAuthUser();
    }
  }, [roles, data, isAuthenticated, error, isError]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated])

  // useEffect(() => {
  //   // Этот useEffect отвечает за проверку пользователя при изменении основных данных
  //   if (!isLoadingUser) {
  //     checkAuthUser();
  //   }
  // }, [data, error, isError, isAuthenticated]);
  
  // useEffect(() => {
  //   // Этот useEffect специально для обработки изменений в ролях и состоянии их загрузки
  //   if (!isLoadingRoles && roles) {
  //     checkAuthUser();
  //   }
  // }, [roles, role, user]);

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
