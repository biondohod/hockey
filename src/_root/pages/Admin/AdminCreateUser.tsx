import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCreateUserAsAdmin } from "../../../lib/react-query/mutations";
import { EditProfileValidation, SignUpValidation } from "../../../lib/validation";
import ProfileForm from "../../../components/ProfileForm/ProfileForm";

const AdminCreateUser = () => {
  const { mutateAsync, isPending } = useCreateUserAsAdmin();
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
    role_id: "3",
  };
  const onSubmit = async (data: EditProfileForm | SignUpForm) => {
    const isMale: boolean = data.gender === "male";
    const phone = data.phone.replace(/[^+\d]/g, "");
    const formattedUser: IEditUser = {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      is_male: isMale,
      phone,
      email: data.email,
      birth_date: data.birth_date,
      telegram: data.telegram,
    };

    if ("role_id" in data) {
      if (data.role_id) {
        formattedUser.role_id = parseInt(data.role_id);
      }
    }

    if (data.password) {
      formattedUser.password = data.password;
    }

    toast.promise(mutateAsync(formattedUser), {
      pending: t("auth.signUp.pending"),
    });
  };

  return (
    <section className="auth auth--editProfile">
      <h1 className="auth__title">{t("global.admin.createUser")}</h1>
      <div className="auth__wrapper">
        <div className="auth__content">
          <ProfileForm
            onSubmit={onSubmit}
            isPending={isPending}
            defaultValues={defaultValues}
            type="signUp"
            validation={SignUpValidation}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminCreateUser;
