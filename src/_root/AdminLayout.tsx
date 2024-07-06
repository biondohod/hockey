import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


/**
 * Функциональный компонент, возвращающий компонент Outlet(вложенные компоненты), если пользователь является администратором, иначе перенаправляет на главную страницу, с сообщением о том, что у пользователя недостаточно прав
 */
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
