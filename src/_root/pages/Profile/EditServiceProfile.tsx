import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";
import { useGetUser } from "../../../lib/react-query/queries";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useUpdateProfile,
  useUpdateProfileAsAdmin,
} from "../../../lib/react-query/mutations";
import { EditServiceProfileValidation } from "../../../lib/validation";
import ProfileFormAdminCreation from "../../../components/ProfileForm/ServiceProfileForm";
import Loader from "../../../components/Loader/Loader";
import ServiceProfileForm from "../../../components/ProfileForm/ServiceProfileForm";
import DeleteProfileOrCompetition from "../../../components/DeleteProfileOrCompetition/DeleteProfileOrCompetition";

const EditServiceProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { isAdmin, user, isLoading } = useUserContext();
  const { data } = useGetUser(id, localStorage.getItem("token"));
  const { mutateAsync: updateUser, isPending } = useUpdateProfile();
  const { mutateAsync: updateUserAsAdmin } = useUpdateProfileAsAdmin();

  const [isUserProfile, setIsUserProfile] = useState(false);
  const [defaultValues, setDefaultValues] =
    useState<EditServiceProfileForm | null>(null);

  useEffect(() => {
    if (user && id) {
      const userId = user.id.toString();
      const paramsId = id.toString();
      if (!isAdmin && !(userId === paramsId)) {
        toast.warning(t("global.noRules"));
        navigate(`/profile/${userId}`);
      }
      if (userId === paramsId) {
        setIsUserProfile(true);
      } else {
        setIsUserProfile(false);
      }
    }
  }, [user, id]);

  useEffect(() => {
    if (data) {
      const { email, first_name, last_name, middle_name, role_id } = data;
      const defaultValues = {
        first_name,
        last_name,
        middle_name,
        email,
        changePassword: false,
        password: "",
        confirmPassword: "",
        role_id: role_id.toString(),
      };
      setDefaultValues(defaultValues);
    }
  }, [data]);

  const onSubmit = async (data: EditServiceProfileForm) => {
    const formattedUser: IEditUser = {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      email: data.email,
    };

    if ("gender" in data) {
      const isMale: boolean = data.gender === "male";
      formattedUser.is_male = isMale;
    }

    if ("phone" in data && data.phone) {
      const phone = data.phone.replace(/[^+\d]/g, "");
      formattedUser.phone = phone;
    }

    if ("birth_date" in data && data.birth_date) {
      formattedUser.birth_date = data.birth_date;
    }

    if ("telegram" in data && data.telegram) {
      formattedUser.telegram = data.telegram;
    }

    if ("role_id" in data) {
      if (data.role_id) {
        formattedUser.role_id = parseInt(data.role_id);
      }
    }

    if ("position" in data) {
      formattedUser.position = data.position;
    }

    if (data.password) {
      formattedUser.password = data.password;
    }

    if (isAdmin) {
      if (!id) return;
      toast.promise(updateUserAsAdmin({ id, user: formattedUser }), {
        pending: t("profile.editProfile.pending"),
      });
    } else {
      toast.promise(updateUser(formattedUser), {
        pending: t("profile.editProfile.pending"),
      });
    }
  };

  return (
    <section className="auth auth--editProfile">
    <h1 className="auth__title">{t("profile.editProfile.title")}</h1>

    <div className="auth__wrapper">
      <div className="auth__content">
        {isLoading || !user || !defaultValues ? (
        <Loader />
        ) : (
          <>
            <ServiceProfileForm
              onSubmit={onSubmit}
              defaultValues={defaultValues}
              isPending={isPending}
              type="edit"
              validation={EditServiceProfileValidation}
            />
            {isUserProfile && <DeleteProfileOrCompetition type="profile"/>}
          </>
        )}
      </div>
    </div>
  </section>
  );
};

export default EditServiceProfile;
