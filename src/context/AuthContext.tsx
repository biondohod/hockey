import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGetCurrentUser} from "../lib/react-query/queries";
import {toast} from "react-toastify";

const INITIAL_STATE = {
    user: null,
    isAuthenticated: false,
    setUser: () => {
    },
    setIsAuthenticated: () => {
    },
    checkAuthUser: async () => false,
    isAdmin: false,
    isLoading: false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const id = localStorage.getItem("id") || null;
    const token = localStorage.getItem("token") || null;
    const [user, setUser] = useState<IUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const {data, error, isError, isLoading} = useGetCurrentUser(id, token);

    const checkAuthUser = async () => {
        if (id && token) {
            if (isError) {
                toast.error(
                    `Ошибка при получении данных пользователя: ${error?.message}`
                );
                localStorage.removeItem("id");
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                navigate("/auth/sign-in");
            } else {
                setUser(data);
                setIsAuthenticated(true);
                if (data?.role_id === 1) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
        }
        return isAuthenticated;
    };

    useEffect(() => {
        checkAuthUser();
    }, [data, error, isError, isAuthenticated]);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
