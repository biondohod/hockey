import { useForm } from "react-hook-form";
import { UseLoginUser } from "../../lib/react-query/mutations";
import { SignInValidation } from "../../lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

/**
 * 
 * @returns {JSX.Element} Функциональный компонент, возвращающий форму для авторизации
 */
const SignIn = (): JSX.Element => {
  const { isPending, mutateAsync } = UseLoginUser();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: {errors} } = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInForm) => {
    toast.promise(mutateAsync(data), {
      pending: t("auth.signIn.pending"),
    });
  };

  return (
    <div
      className="auth__sign-in"
    >

      <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
        <label htmlFor="phone" className="auth__label">
          {t("auth.email")}
          <input
            type="email"
            id="phone"
            className="auth__input"
            {...register("email")}
            required={true}
            autoComplete="off"
            {...(errors.email && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {errors.email && errors.email.message && (
            <span className="auth__error-msg">{t(errors.email.message)}</span>
          )}
        </label>

        <label htmlFor="password" className="auth__label">
          {t("auth.password")}
          <input
            type="password"
            id="password"
            className="auth__input"
            {...register("password")}
            placeholder={t("auth.passwordPlaceholder")}
            required={true}
          />
        </label>
        <button type="submit" className="auth__submit" disabled={isPending}>
          {t("auth.signIn.signInButton")}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
