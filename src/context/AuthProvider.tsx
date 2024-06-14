import { FC } from "react";
import Loader from "../components/Loader/Loader";
import { useTranslation } from "react-i18next";

type AuthProviderProps = {
  isAuth: boolean | null;
  children: React.ReactNode;
};
/**
 * AuthProvider component provides authentication status to its children.
 * @param {AuthProviderProps} props The props for the Loader component.
 * @param {boolean | null} props.isAuth - The authentication status.
 * @param {ReactNode} props.children - The child components.
 * @returns {ReactNode} - The rendered child components or a loader message.
 */
const AuthProvider: FC<AuthProviderProps> = ({ isAuth, children }) => {
  const { t } = useTranslation();
  if (isAuth !== null) {
    return children;
  }
  return <Loader message={t("auth.checking")} marginTop={"50vh"}/>;
};

export default AuthProvider;