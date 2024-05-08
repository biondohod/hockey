import { Link, Route, Router, useParams } from "react-router-dom";
import "./Authorization.scss";

import React, { useEffect } from "react";
import SignIn from "../../../_auth/forms/SignIn";
import SignUp from "../../../_auth/forms/SignUp";

const Authorization = () => {
  const [isSignIn, setIsSignIn] = React.useState(true);
  const authType = useParams();

  useEffect(() => { 
    if (authType.type === "sign-in") {
      setIsSignIn(true);
    } else {
      setIsSignIn(false);
    }
  }, [authType]);

  return (
    <section className="auth">
      <h1 className="auth__title">{isSignIn ? "Вход" : "Регистрация"}</h1>

      <div className="auth__wrapper">
        <div className="auth__tabs">
          <Link to={"/auth/sign-in"}
            // onClick={handleTabClick}
            // скорее всего эти классы излишни нужно будет удалить
            className={`auth__btn ${isSignIn ? "auth__btn--active" : ""}`}
          >
            Вход
          </Link>
          <Link to={"/auth/sign-up"}
            // onClick={handleTabClick}
            className={`auth__btn ${isSignIn ? "" : "auth__btn--active"}`}
            // disabled={!isSignIn}
          >
            Регистрация
          </Link>
        </div>

        <div className="auth__content">
          {isSignIn ? <SignIn /> : <SignUp />}
        </div>
      </div>
    </section>
  );
};

export default Authorization;
