import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();
  return <>{!isAuthenticated ? <Navigate to="/auth/sign-in" /> : <Outlet />}</>;
};

export default RootLayout;
