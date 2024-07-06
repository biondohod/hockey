import {Link, useParams} from "react-router-dom";
import "./Authorization.scss";

import React, {useEffect} from "react";
import SignIn from "../../../_auth/forms/SignIn";
import SignUp from "../../../_auth/forms/SignUp";
import { useTranslation } from "react-i18next";

/**
 * 
 * @returns {JSX.Element} Функциональный компонент, возвращающий страницу авторизации с компонентами SignIn или SignUp в зависимости от выбранной вкладки
 */
const Authorization = (): JSX.Element => {
    const [isSignIn, setIsSignIn] = React.useState(true);
    const authType = useParams();
    const {t} = useTranslation();

    useEffect(() => {
        if (authType.type === "sign-in") {
            setIsSignIn(true);
        } else {
            setIsSignIn(false);
        }
    }, [authType]);


    return (
        <section className="auth">
            <h1 className="auth__title">{isSignIn ? t("auth.authSignIn") : t("auth.authSignUp")}</h1>

            <div className="auth__wrapper">
                <div className="auth__tabs">
                    <Link to={"/auth/sign-in"}
                          className={`auth__btn ${isSignIn ? "auth__btn--active" : ""}`}
                    >
                        {t("auth.authSignIn")}
                    </Link>
                    <Link to={"/auth/sign-up"}
                          className={`auth__btn ${isSignIn ? "" : "auth__btn--active"}`}
                    >
                        {t("auth.authSignUp")}
                    </Link>
                </div>

                <div className="auth__content">
                    {isSignIn ? <SignIn/> : <SignUp/>}
                </div>
            </div>
        </section>
    );
};

export default Authorization;
