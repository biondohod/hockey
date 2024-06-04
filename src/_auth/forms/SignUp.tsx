import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpValidation } from "../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserAccount } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { mutateAsync, isPending } = useCreateUserAccount();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      gender: "",
      phone: "",
      email: "",
      birth_date: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value
      .replace(/.(?=.*\+)/g, "")
      .replace(/[^+\d]/g, "");

    if (value.startsWith("8")) {
      value = "+7" + value.substring(1);
    } else if (!value.startsWith("+") && value.length > 0) {
      value = "+" + value;
    }

    if (value.length > 2) {
      value = value.replace(/^(\+\d)(\d{1,3})/, "$1 ($2");
    }

    if (value.length > 7) {
      value = value.replace(/^(\+\d \(\d{1,3})(\d{1,3})/, "$1) $2");
    }

    if (value.length > 11) {
      value = value.replace(/^(\+\d \(\d{3}\) \d{3})(\d{1,2})/, "$1-$2");
    }

    if (value.length > 14) {
      value = value.replace(/^(\+\d \(\d{3}\) \d{3}-\d{2})(\d{1,2})/, "$1-$2");
    }

    if (value.length > 18) {
      value = value.substring(0, 18);
    }

    setValue("phone", value);

    if (value.length === 18) {
      trigger("phone");
    }
  };

  const handlePhoneFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setValue("phone", "+");
    }
  };

  const handlePhoneBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length === 1) {
      setValue("phone", "");
    }
  };

  const handleTelegramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value
      .replace(/.(?=.*@)/g, "")
      .replace(/[^@\w]/g, "");

    if (value && !value.startsWith("@")) {
      value = "@" + value;
    }

    setValue("telegram", value);

    if (!value || value.length === 6) {
      trigger("telegram");
    }
  };

  const handleTelegramFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setValue("telegram", "@");
    }
  };

  const handleTelegramBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length === 1) {
      setValue("telegram", "");
    }
  };

  const onSubmit = (data: SignUpForm) => {
    const isMale: boolean = data.gender === "male";
    const phone = data.phone.replace(/[^+\d]/g, "");
    const newUser: INewUser = {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      is_male: isMale,
      phone,
      email: data.email,
      birth_date: data.birth_date,
      telegram: data.telegram,
      password: data.password,
    };
    toast.promise(mutateAsync(newUser), {
      pending: t("auth.signUp.pending"),
    });
  };

  return (
    <div className="auth__sign-up">
      <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
        <label htmlFor="last_name" className="auth__label">
          {t("auth.signUp.lastName")}*
          <input
            type="text"
            id="last_name"
            className="auth__input"
            required={true}
            autoComplete="off"
            maxLength={16}
            {...register("last_name")}
            {...(errors.last_name && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {errors.last_name && errors.last_name.message && (
            <span className="auth__error-msg">
              {t(errors.last_name.message)}
            </span>
          )}
        </label>

        <label htmlFor="first_name" className="auth__label">
          {t("auth.signUp.firstName")}*
          <input
            type="text"
            id="first_name"
            className="auth__input"
            required={true}
            autoComplete="off"
            maxLength={16}
            {...register("first_name")}
            {...(errors.first_name && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {errors.first_name && errors.first_name.message && (
            <span className="auth__error-msg">
              {t(errors.first_name.message)}
            </span>
          )}
        </label>

        <label htmlFor="middle_name" className="auth__label">
          {t("auth.signUp.middleName")}*
          <input
            type="text"
            id="middle_name"
            className="auth__input"
            required={true}
            autoComplete="off"
            maxLength={16}
            {...register("middle_name")}
            {...(errors.middle_name && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {(errors.middle_name && errors.middle_name.message) && (
            <span className="auth__error-msg">
              {t(errors.middle_name.message)}
            </span>
          )}
        </label>

        <label htmlFor="gender" className="auth__label">
          {t("auth.signUp.sex.sex")}*
          <select
            id="gender"
            className="auth__input"
            required={true}
            defaultValue={""}
            {...register("gender")}
            {...(errors.gender && {
              style: { borderColor: "red", outline: "none" },
            })}
          >
            <option hidden disabled value="">
              {t("auth.signUp.sex.unspecified")}
            </option>
            <option value="male">{t("auth.signUp.sex.male")}</option>
            <option value="female">{t("auth.signUp.sex.female")}</option>
          </select>
          {(errors.gender && errors.gender.message) && (
            <span className="auth__error-msg">{t(errors.gender.message)}</span>
          )}
        </label>

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
          {t("auth.signUp.phone")}*
          <input
            id="phone"
            className="auth__input"
            required={true}
            autoComplete="off"
            {...register("phone")}
            {...(errors.phone && {
              style: { borderColor: "red", outline: "none" },
            })}
            // value={phone}
            onChange={handlePhoneChange}
            onFocus={handlePhoneFocus}
            onBlur={handlePhoneBlur}
            // pattern="\+9 \(\d{3}\) \d{3}-\d{2}-\d{2}"
          />
          {(errors.phone && errors.phone.message) && (
            <span className="auth__error-msg">{t(errors.phone.message)}</span>
          )}
        </label>

        <label htmlFor="email" className="auth__label">
          {t("auth.email")}*
          <input
            id="email"
            className="auth__input"
            required={true}
            autoComplete="off"
            {...register("email")}
            {...(errors.email && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {(errors.email && errors.email.message) && (
            <span className="auth__error-msg">{t(errors.email.message)}</span>
          )}
        </label>

        <label htmlFor="birth_date" className="auth__label">
          {t("auth.signUp.birthDate")}*
          <input
            type="date"
            id="birth_date"
            className="auth__input"
            required={true}
            {...register("birth_date")}
            {...(errors.birth_date && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {(errors.birth_date && errors.birth_date.message) && (
            <span className="auth__error-msg">{t(errors.birth_date.message)}</span>
          )}
        </label>

        <label htmlFor="telegram" className="auth__label">
          {t("auth.signUp.telegramUsername")}
          <input
            type="text"
            id="telegram"
            className="auth__input"
            {...register("telegram")}
            // value={telegram}
            onChange={handleTelegramChange}
            onFocus={handleTelegramFocus}
            onBlur={handleTelegramBlur}
            autoComplete="off"
            {...(errors.telegram && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {(errors.telegram && errors.telegram.message) && (
            <span className="auth__error-msg">{t(errors.telegram.message)}</span>
          )}
        </label>

        <label htmlFor="password" className="auth__label">
          {t("auth.password")}
          <input
            type="password"
            id="password"
            className="auth__input"
            placeholder={t("auth.passwordPlaceholder")}
            required={true}
            {...register("password")}
            {...(errors.password && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {(errors.password && errors.password.message) && (
            <span className="auth__error-msg">{t(errors.password.message)}</span>
          )}
        </label>

        <label htmlFor="confirmPassword" className="auth__label">
          {t("auth.signUp.confirmPassword")}
          <input
            type="password"
            id="confirmPassword"
            className="auth__input"
            placeholder={t("auth.passwordPlaceholder")}
            required={true}
            {...register("confirmPassword")}
            {...(errors.confirmPassword && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {(errors.confirmPassword && errors.confirmPassword.message) && (
            <span className="auth__error-msg">
              {t(errors.confirmPassword.message)}
            </span>
          )}
        </label>

        <div className="auth__checkbox">
          <input type="checkbox" name="agreed" id="checkbox" required />
          <label htmlFor="checkbox">{t("auth.signUp.policy")}</label>
        </div>

        <button type="submit" className="auth__submit" disabled={isPending}>
          {t("auth.signUp.signUp")}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
