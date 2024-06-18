import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AdminLayout = () => {
  const { isLoading, isAdmin } = useUserContext();
  const {t} = useTranslation();
  if (isAdmin === false && !isLoading) {
    toast.warn(t("global.noRules"));
    return (
      <>
        <Navigate to="/"/>
      </>
    );
  }
  return <Outlet />;
};

export default AdminLayout;
