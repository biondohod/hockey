import React from "react";

const SignIn = () => {
  return (
    <div
      className="auth__sign-in"
      // style={{ display: isSignIn ? "flex" : "none" }}
    >
      <form action="" className="auth__form">
        <label htmlFor="phone" className="auth__label">
          Почта или телефон
        </label>
        <input type="text" id="phone" className="auth__input" required={true} />

        <label htmlFor="password" className="auth__label">
          Пароль
        </label>
        <input
          type="password"
          id="password"
          className="auth__input"
          placeholder="Введите ваш пароль"
        />
        <div className="auth__checkbox">
          <input type="checkbox" name="rememberme" id="rememberme" />
          <label htmlFor="rememberme">Сохранить вход</label>
        </div>
        <button className="auth__submit">Вход</button>
      </form>
    </div>
  );
};

export default SignIn;
