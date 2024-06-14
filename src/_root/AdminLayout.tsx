import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const { isLoading, isAdmin } = useUserContext();
  if (!isAdmin && !isLoading) {
    console.log(isAdmin, isLoading)
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
