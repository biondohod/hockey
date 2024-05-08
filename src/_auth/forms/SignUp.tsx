import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpValidation } from "../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUp = () => {
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      // is_male: undefined,
      phone: "",
      email: "",
      birth_date: "",
      password: "",
    },
  });
  

  // const {} = useForm({resolver: zodResolver(SignUpValidation)});

  const onSubmit = (data: INewUser) => {
    console.log("worked")
    console.log(data)
  }
  
  return (
    <div
      className="auth__sign-up"
      // style={{ display: isSignIn ? "none" : "flex" }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth__form">
        <label htmlFor="last_name" className="auth__label">
          Фамилия*
        </label>
        <input
          type="text"
          id="last_name"
          className="auth__input"
          required={true}
          {...form.register("last_name")}
        />

        <label htmlFor="first_name" className="auth__label">
          Имя*
        </label>
        <input
          type="text"
          id="first_name"
          className="auth__input"
          required={true}
          {...form.register("first_name")}
        />

        <label htmlFor="middle_name" className="auth__label">
          Отчество*
        </label>
        <input
          type="text"
          id="middle_name"
          className="auth__input"
          required={true}
          {...form.register("middle_name")}
        />

        {/* <label htmlFor="gender" className="auth__label">
          Пол*
        </label>
        <select
          name="gender"
          id="gender"
          className="auth__input"
          required={true}
          defaultValue={""}
        >
          <option hidden disabled value="">
            Не указан
          </option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select> */}

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
          type="text"
          id="phone"
          className="auth__input"
          required={true}
          {...form.register("phone")}
        />

        <label htmlFor="email" className="auth__label">
          Почта*
        </label>
        <input
          id="email"
          className="auth__input"
          required={true}
          {...form.register("email")}
        />

        <label htmlFor="birth_date" className="auth__label">
          Дата рождения*
        </label>
        <input
          type="date"
          id="birth_date"
          className="auth__input"
          required={true}
          {...form.register("birth_date")}
        />

        <label htmlFor="telegram" className="auth__label">
          Логин telegram
        </label>
        <input
          type="text"
          id="telegram"
          className="auth__input"
          {...form.register("telegram")}
        />

        <label htmlFor="password" className="auth__label">
          Пароль
        </label>
        <input
          type="password"
          id="password"
          className="auth__input"
          placeholder="Введите ваш пароль"
          required={true}
          {...form.register("password")}
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
  );
};

export default SignUp;
