import { useEffect, useState } from "react";
import { useUserContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateProfile,
  useUpdateProfileAsAdmin,
} from "../../../lib/react-query/mutations";
import Loader from "../../../components/Loader/Loader";
import ProfileForm from "../../../components/ProfileForm/ProfileForm";
import { useTranslation } from "react-i18next";
import { formatPhoneNumber } from "../../../lib/utils";
import { EditProfileValidation } from "../../../lib/validation";
import { useGetUser } from "../../../lib/react-query/queries";

const EditProfile = () => {
  const { isAdmin, user, isLoading } = useUserContext();
  const { id } = useParams<{ id: string }>();
  const { data } = useGetUser(id, localStorage.getItem("token"));
  const navigate = useNavigate();
  const { mutateAsync: updateUser, isPending } = useUpdateProfile();
  const { mutateAsync: updateUserAsAdmin } = useUpdateProfileAsAdmin();
  const [defaultValues, setDefaultValues] = useState<SignUpForm | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && id) {
      const userId = user.id.toString();
      const paramsId = id.toString();
      if (!isAdmin && !(userId === paramsId)) {
        toast.warning("You don't have permission to edit this profile");
        navigate(`/profile/${userId}`);
      }
    } else if (!isLoading && !user) {
      console.log(user, isLoading);
      toast.warning("You need to be logged in to edit your profile");
      navigate("/");
    }
  }, [user, id]);

  useEffect(() => {
    if (data) {
      const { email, first_name, last_name, middle_name, player, role_id } =
        data;
      const defaultValues = {
        first_name,
        last_name,
        middle_name,
        gender: player.is_male ? "male" : "female",
        phone: formatPhoneNumber(player.phone),
        email,
        birth_date: player.birth_date,
        changePassword: false,
        password: "",
        confirmPassword: "",
        telegram: player.telegram,
        role_id: role_id.toString(),
      };
      setDefaultValues(defaultValues);
    }
  }, [user]);

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

    if (isAdmin) {
      if (!id) return;
      toast.promise(updateUserAsAdmin({ id, user: formattedUser }), {
        pending: "Updating profile...",
      });
    } else {
      toast.promise(updateUser(formattedUser), {
        pending: "Updating profile...",
      });
    }
  };
  return (
    <>
      <section className="auth auth--editProfile">
        <h1 className="auth__title">{t("profile.editProfile.title")}</h1>

        <div className="auth__wrapper">
          <div className="auth__content">
            {isLoading || !user || !defaultValues ? (
              <Loader />
            ) : (
              <ProfileForm
                onSubmit={onSubmit}
                defaultValues={defaultValues}
                isPending={isPending}
                type="edit"
                validation={EditProfileValidation}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;
