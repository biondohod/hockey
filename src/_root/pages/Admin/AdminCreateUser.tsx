import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCreateUserAsAdmin } from "../../../lib/react-query/mutations";
import { EditProfileValidation, SignUpValidation } from "../../../lib/validation";
import ProfileForm from "../../../components/ProfileForm/ProfileForm";
import ProfileFormAdminCreation from "../../../components/ProfileForm/ProfileFormAdminCreation";

const AdminCreateUser = () => {
  const { mutateAsync, isPending } = useCreateUserAsAdmin();
  const { t } = useTranslation();

  // const defaultValues = {
  //   first_name: "",
  //   last_name: "",
  //   middle_name: "",
  //   gender: "",
  //   phone: "",
  //   email: "",
  //   birth_date: "",
  //   password: "",
  //   confirmPassword: "",
  //   role_id: "3",
  // };
  const onSubmit = async (data: CreateUserForm) => {
    const formattedUser: INewUserAdmin = {
      role_id: data.role_id,
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      email: data.email,
      password: data.password,
    };

    if (data.role_id !== "1" && data.role_id !== "2") {
      formattedUser.is_male = data.gender === "male";
      formattedUser.phone = data.phone?.replace(/[^+\d]/g, "");
      formattedUser.birth_date = data.birth_date;
      formattedUser.telegram = data.telegram;
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
          <ProfileFormAdminCreation
            onSubmit={onSubmit}
            isPending={isPending}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminCreateUser;
