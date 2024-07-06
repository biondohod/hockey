import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../context/AuthContext";

/**
 * 
 * @returns {JSX.Element}  Функциональный компонент, возвращающий компонент Outlet(вложенные компоненты), если пользователь не аутентифицирован, иначе перенаправляет на главную страницу

 */
const AuthLayout = (): JSX.Element => {
    const {isAuthenticated} = useUserContext();
    return <>{isAuthenticated ? <Navigate to="/"/> : <Outlet/>}</>;
};

export default AuthLayout;
