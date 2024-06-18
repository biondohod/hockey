import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../context/AuthContext";
import {toast} from "react-toastify";
import { useTranslation } from "react-i18next";

const RootLayout = () => {
    const {isAuthenticated, isLoading} = useUserContext();
    const {t} = useTranslation();
    if (!isAuthenticated && !isLoading) {
        toast.warn(t("global.notAuthorized"));
    }
    return <>{!isAuthenticated && !isLoading ? <Navigate to="/auth/sign-in"/> : <Outlet/>}</>;
};

export default RootLayout;
