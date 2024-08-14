import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CreateUserValidation,
  EditServiceProfileValidation,
  SignUpValidation,
} from "../../lib/validation";
import InputMask from "react-input-mask";
import { z } from "zod";

type ServiceProfileFormProps = {
  onSubmit:
    | ((data: CreateUserForm) => void)
    | ((data: EditServiceProfileForm) => void);
  isPending: boolean;
  defaultValues: CreateUserForm | EditServiceProfileForm;
  type: "create" | "edit";
  validation: z.ZodType<
    | z.infer<typeof CreateUserValidation>
    | z.infer<typeof EditServiceProfileValidation>
  >;
};

const ServiceProfileForm: FC<ServiceProfileFormProps> = ({
  onSubmit,
  isPending,
  defaultValues,
  type,
  validation,
}) => {
  const { t } = useTranslation();
  const [editPassword, setEditPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateUserForm | EditServiceProfileForm>({
    resolver: zodResolver(validation),
    defaultValues,
  });

  const role_id = watch("role_id");

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
    console.log(errors);
  };

  const handleTelegramBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length === 1) {
      setValue("telegram", "");
    }
  };

  const showError = () => {
    console.log(errors);
  };

  return (
    <div className="auth__sign-up">
      <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
        <label htmlFor="role_id" className="auth__label">
          {t("profile.editProfile.role")}*
          <select
            id="role_id"
            className="auth__input"
            required={true}
            autoComplete="off"
            defaultValue={"3"}
            {...register("role_id")}
          >
            <option value={"1"}>Администратор</option>
            <option value={"2"}>Судья</option>
            <option value={"3"}>Неподтвержденный</option>
            <option value={"4"}>Игрок</option>
            <option value={"5"}>Спартаковец</option>
          </select>
        </label>
        <label htmlFor="last_name" className="auth__label">
          {t("auth.signUp.lastName")}*
          <input
            type="text"
            id="last_name"
            className="auth__input"
            required={true}
            autoComplete="off"
            maxLength={16}
            onFocus={showError}
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
          {errors.middle_name && errors.middle_name.message && (
            <span className="auth__error-msg">
              {t(errors.middle_name.message)}
            </span>
          )}
        </label>

        <label htmlFor="email" className="auth__label">
          {t("auth.email")}*
          <input
            id="email"
            className="auth__input"
            required={true}
            autoComplete="off"
            type="email"
            {...register("email")}
            {...(errors.email && {
              style: { borderColor: "red", outline: "none" },
            })}
          />
          {errors.email && errors.email.message && (
            <span className="auth__error-msg">{t(errors.email.message)}</span>
          )}
        </label>

        {role_id !== "1" && role_id !== "2" && (
          <>
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
              {errors.gender && errors.gender.message && (
                <span className="auth__error-msg">
                  {t(errors.gender.message)}
                </span>
              )}
            </label>

            <label htmlFor="position" className="auth__label">
              {t("profile.editProfile.position")}*
              <select
                id="position"
                className="auth__input"
                required={true}
                autoComplete="off"
                {...register("position")}
              >
                <option value={"Нападающий"}>Нападающий</option>
                <option value={"Центральный нападающий"}>
                  Центральный нападающий
                </option>
                <option value={"Защитник"}>Защитник</option>
                <option value={"Вратарь"}>Вратарь</option>
              </select>
            </label>

            <label htmlFor="preparation" className="auth__label">
              {t("profile.editProfile.preparation")}*
              <select
                id="preparation"
                className="auth__input"
                required={true}
                autoComplete="off"
                {...register("preparation")}
              >
                <option value={"III юношеский спортивный разряд"}>
                  III юношеский спортивный разряд
                </option>
                <option value={"II юношеский спортивный разряд"}>
                  II юношеский спортивный разряд
                </option>
                <option value={"I юношеский спортивный разряд"}>
                  I юношеский спортивный разряд
                </option>
                <option value={"III спортивный разряд"}>
                  III спортивный разряд
                </option>
                <option value={"II спортивный разряд"}>
                  II спортивный разряд
                </option>
                <option value={"I спортивный разряд"}>
                  I спортивный разряд
                </option>
                <option value={"Кандидат в мастера спорта"}>
                  Кандидат в мастера спорта
                </option>
                <option value={"Мастер спорта России"}>
                  Мастер спорта России
                </option>
                <option value={"Мастер спорта России международного класса"}>
                  Мастер спорта России международного класса
                </option>
              </select>
            </label>

            <label htmlFor="phone" className="auth__label">
              {t("auth.signUp.phone")}*
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputMask
                    {...field}
                    mask="+9 (999) 999-99-99"
                    id="phone"
                    className="auth__input"
                    required={true}
                    autoComplete="off"
                    {...(errors.phone && {
                      style: { borderColor: "red", outline: "none" },
                    })}
                  />
                )}
              />
              {errors.phone && errors.phone.message && (
                <span className="auth__error-msg">
                  {t(errors.phone.message)}
                </span>
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
              {errors.birth_date && errors.birth_date.message && (
                <span className="auth__error-msg">
                  {t(errors.birth_date.message)}
                </span>
              )}
            </label>

            <label htmlFor="telegram" className="auth__label">
              {t("auth.signUp.telegramUsername")}
              <input
                type="text"
                id="telegram"
                className="auth__input"
                required={true}
                {...register("telegram")}
                onChange={handleTelegramChange}
                onFocus={handleTelegramFocus}
                onBlur={handleTelegramBlur}
                autoComplete="off"
                {...(errors.telegram && {
                  style: { borderColor: "red", outline: "none" },
                })}
              />
              {errors.telegram && errors.telegram.message && (
                <span className="auth__error-msg">
                  {t(errors.telegram.message)}
                </span>
              )}
            </label>
          </>
        )}

        {type === "edit" && (
          <>
            <div className="auth__checkbox">
              <input
                type="checkbox"
                name="editPassword"
                id="editPassword"
                onChange={() => setEditPassword(!editPassword)}
              />
              <label htmlFor="editPassword">
                {t("profile.editProfile.editPassword")}
              </label>
            </div>
          </>
        )}

        {editPassword ||
          (type === "create" && (
            <>
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
                {errors.password && errors.password.message && (
                  <span className="auth__error-msg">
                    {t(errors.password.message)}
                  </span>
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
                {errors.confirmPassword && errors.confirmPassword.message && (
                  <span className="auth__error-msg">
                    {t(errors.confirmPassword.message)}
                  </span>
                )}
              </label>
            </>
          ))}

        {/* <label htmlFor="password" className="auth__label">
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
          {errors.password && errors.password.message && (
            <span className="auth__error-msg">
              {t(errors.password.message)}
            </span>
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
          {errors.confirmPassword && errors.confirmPassword.message && (
            <span className="auth__error-msg">
              {t(errors.confirmPassword.message)}
            </span>
          )}
        </label> */}

        {}

        <button type="submit" className="auth__submit" disabled={isPending}>
          {type === "create"
            ? t("auth.signUp.signUp")
            : t("profile.editProfile.save")}
        </button>
      </form>
    </div>
  );
};

export default ServiceProfileForm;
