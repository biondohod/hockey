import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCreateUserAsAdmin } from "../../../lib/react-query/mutations";
import ProfileFormAdminCreation from "../../../components/ProfileForm/ServiceProfileForm";
import { useGetRoles } from "../../../lib/react-query/queries";
import { getUserRole } from "../../../lib/utils";
import { CreateUserValidation } from "../../../lib/validation";
import ServiceProfileForm from "../../../components/ProfileForm/ServiceProfileForm";

/**
 * 
 * @returns {JSX.Element} Функциональный компонент, который возвращает разметку страницы создания пользователя администратором
 */
const AdminCreateUser = (): JSX.Element => {
  const { mutateAsync, isPending } = useCreateUserAsAdmin();
  const { data: roles } = useGetRoles();
  const { t } = useTranslation();

  const defaultValues = {
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    role_id: "3",
    changePassword: false,
  }

  const onSubmit = async (data: CreateUserForm) => {
    const formattedUser: INewUserAdmin = {
      role_id: parseInt(data.role_id),
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      email: data.email,
      password: data.password || "",
    };

    const role: Irole | { name: string } = getUserRole(
      parseInt(data.role_id),
      roles
    );

    if ('can_participate' in role && (role.can_participate || role.name === "Неподтвержденный")) {
      formattedUser.is_male = data.gender === "male";
      formattedUser.phone = data.phone?.replace(/[^+\d]/g, "");
      formattedUser.birth_date = data.birth_date;
      formattedUser.telegram = data.telegram;
      formattedUser.position = data.position;
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
          <ServiceProfileForm onSubmit={onSubmit} isPending={isPending} validation={CreateUserValidation} type="create" defaultValues={defaultValues}/>
        </div>
      </div>
    </section>
  );
};

export default AdminCreateUser;
