import { useForm } from "react-hook-form";
import { UseLoginUser } from "../../lib/react-query/mutations";
import { SignInValidation } from "../../lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { isPending, mutateAsync } = UseLoginUser();
  const { t } = useTranslation();

  const { register, handleSubmit } = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInForm) => {
    // console.log(data);
    toast.promise(mutateAsync(data), {
      pending: t("auth.signIn.pending"),
    });
  };

  return (
    <div
      className="auth__sign-in"
      // style={{ display: isSignIn ? "flex" : "none" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
        <label htmlFor="phone" className="auth__label">
          {t("auth.signIn.email")}
          <input
            type="email"
            id="phone"
            className="auth__input"
            {...register("email")}
            required={true}
            autoComplete="off"
          />
        </label>

        <label htmlFor="password" className="auth__label">
          {t("auth.signIn.password")}
          <input
            type="password"
            id="password"
            className="auth__input"
            {...register("password")}
            placeholder={t("auth.signIn.passwordPlaceholder")}
          />
        </label>
        {/* <div className="auth__checkbox">
          <input type="checkbox" name="rememberme" id="rememberme" />
          <label htmlFor="rememberme">Сохранить вход</label>
        </div> */}
        <button type="submit" className="auth__submit" disabled={isPending}>
          {t("auth.signIn.signInButton")}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
