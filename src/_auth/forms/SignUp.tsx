import { SignUpValidation } from "../../lib/validation";
import { useCreateUserAccount } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ProfileForm from "../../components/ProfileForm/ProfileForm";

/**
 * 
 * @returns {JSX.Element}   Функциональный компонент, возвращающий форму для создания нового пользователя, используя компонент ProfileForm

 */
const SignUp = (): JSX.Element => {
  const { mutateAsync, isPending } = useCreateUserAccount();
  const { t } = useTranslation();

  const defaultValues = {
    first_name: "",
    last_name: "",
    middle_name: "",
    gender: "",
    phone: "",
    email: "",
    birth_date: "",
    password: "",
    confirmPassword: "",
    position: "player",
    telegram: "",
  };

  const onSubmit = (data: SignUpForm | EditProfileForm) => {
    const isMale: boolean = data.gender === "male";
    const phone = data.phone.replace(/[^+\d]/g, "");
    if ("password" in data && data.password) {
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
        position: data.position,
      };
      toast.promise(mutateAsync(newUser), {
        pending: t("auth.signUp.pending"),
      });
    }
  };

  return (
    <ProfileForm
      onSubmit={onSubmit}
      isPending={isPending}
      defaultValues={defaultValues}
      type="signUp"
      validation={SignUpValidation}
    />
  );
};

export default SignUp;
