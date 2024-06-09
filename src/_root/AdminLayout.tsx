import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const { user, isLoading } = useUserContext();
  if (!(user?.role_id === 1 || user?.role_id === 2) && !isLoading && user) {
    toast.warn("У вас недостаточно прав, чтобы просматривать эту страницу");
    return (
      <>
        <Navigate to="/"/>
      </>
    );
  }
  return <Outlet />;
};

export default AdminLayout;
