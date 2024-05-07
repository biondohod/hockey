import "./Authorization.scss";

import React from "react";

const Authorization = () => {
  const [isSignIn, setIsSignIn] = React.useState(true);

  const handleTabClick = () => {
    setIsSignIn(!isSignIn);
  };
  return (
    <section className="auth">
      <h1 className="auth__title">{isSignIn ? "Вход" : "Регистрация"}</h1>

      <div className="auth__wrapper">
        <div className="auth__tabs">
          <button
            onClick={handleTabClick}
            // скорее всего эти классы излишни нужно будет удалить
            className={`auth__btn ${isSignIn ? "auth__btn--active" : ""}`}
            disabled={isSignIn}
          >
            Вход
          </button>
          <button
            onClick={handleTabClick}
            className={`auth__btn ${isSignIn ? "" : "auth__btn--active"}`}
            disabled={!isSignIn}
          >
            Регистрация
          </button>
        </div>

        <div className="auth__content">
          <div
            className="auth__sign-in"
            style={{ display: isSignIn ? "flex" : "none" }}
          >
            <form action="" className="auth__form">
              <label htmlFor="phone" className="auth__label">
                Почта или телефон
              </label>
              <input
                type="text"
                id="phone"
                className="auth__input"
                required={true}
              />

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
          <div
            className="auth__sign-up"
            style={{ display: isSignIn ? "none" : "flex" }}
          >
            <form action="" className="auth__form">
              <label htmlFor="last_name" className="auth__label">
                Фамилия*
              </label>
              <input
                name="last_name"
                type="text"
                id="last_name"
                className="auth__input"
                required={true}
              />

              <label htmlFor="first_name" className="auth__label">
                Имя*
              </label>
              <input
                name="first_name"
                type="text"
                id="first_name"
                className="auth__input"
                required={true}
              />

              <label htmlFor="middle_name" className="auth__label">
                Отчество*
              </label>
              <input
                name="middle_name"
                type="text"
                id="middle_name"
                className="auth__input"
                required={true}
              />

              <label htmlFor="gender" className="auth__label">
                Пол*
              </label>
              <select
                name="gender"
                id="gender"
                className="auth__input"
                required={true}
              >
                <option hidden disabled selected value="">
                  Не указан
                </option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>

              {/* <label htmlFor="level" className="auth__label">
                Уровень подготовки
              </label>
              <select name="level" id="level" className="auth__input">
                <option value="no_exp">Не указан</option>
                <option value="male">
                  Мастер спорта России международного класса
                </option>
                <option value="female">Мастер спорта России</option>
                <option value="female">Кандидат в мастера спорта</option>
                <option value="female">I спортивный разряд</option>
                <option value="female">II спортивный разряд</option>
                <option value="female">III спортивный разряд</option>
                <option value="female">I юношеский спортивный разряд</option>
                <option value="female">II юношеский спортивный разряд</option>
                <option value="female">III юношеский спортивный разряд</option>
              </select> */}

              <label htmlFor="phone" className="auth__label">
                Номер телефона*
              </label>
              <input
                name="phone"
                type="text"
                id="phone"
                className="auth__input"
                required={true}
              />

              <label htmlFor="email" className="auth__label">
                Почта*
              </label>
              <input
                type="email"
                id="email"
                className="auth__input"
                required={true}
              />

              <label htmlFor="birth_date" className="auth__label">Дата рождения*</label>
              <input
                name="birth_date"
                type="date"
                id="birth_date"
                className="auth__input"
                required={true}
              />

              <label htmlFor="telegram" className="auth__label">
                Логин telegram
              </label>
              <input
                name="telegram"
                type="text"
                id="telegram"
                className="auth__input"
              />

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
                <input type="checkbox" name="agreed" id="checkbox" required />
                <label htmlFor="checkbox">
                  Согласие на обработку персональных данных
                </label>
              </div>

              <button className="auth__submit">Зарегистрироваться</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Authorization;
