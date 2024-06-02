import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../context/AuthContext";
import {toast} from "react-toastify";

const RootLayout = () => {
    const {isAuthenticated, isLoading} = useUserContext();
    if (!isAuthenticated && !isLoading) {
        toast.warn("Вы должны авторизоваться, чтобы просматривать эту страницу");
    }
    return <>{!isAuthenticated && !isLoading ? <Navigate to="/auth/sign-in"/> : <Outlet/>}</>;
};

export default RootLayout;
