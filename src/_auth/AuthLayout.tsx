import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  return <>{isAuthenticated ? <Navigate to="/" /> : <Outlet />}</>;
};

export default AuthLayout;
