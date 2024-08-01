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
import { EditProfileValidation } from "../../../lib/validation";
import { useGetUser } from "../../../lib/react-query/queries";
import DeleteProfileOrCompetition from "../../../components/DeleteProfileOrCompetition/DeleteProfileOrCompetition";

const EditProfile = () => {
  const { isAdmin, user, isLoading } = useUserContext();
  const { id } = useParams<{ id: string }>();
  const { data } = useGetUser(id, localStorage.getItem("token"));
  const navigate = useNavigate();
  const [isUserProfile, setIsUserProfile] = useState(false);
  const { mutateAsync: updateUser, isPending } = useUpdateProfile();
  const { mutateAsync: updateUserAsAdmin } = useUpdateProfileAsAdmin();
  const [defaultValues, setDefaultValues] = useState<SignUpForm | null>(null);
  const { t } = useTranslation();

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
      // } else if (!isLoading && !user) {
      //   toast.warning("You need to be logged in to edit your profile");
      //   navigate("/");
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
        phone: player.phone,
        email,
        birth_date: player.birth_date,
        changePassword: false,
        password: "",
        confirmPassword: "",
        position: player.position,
        preparation: player.preparation,
        telegram: player.telegram,
        role_id: role_id.toString(),
      };
      setDefaultValues(defaultValues);
    }
  }, [data]);

  const onSubmit = async (data: EditProfileForm | SignUpForm) => {
    console.log(data);
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

    if ("position" in data) {
      formattedUser.position = data.position;
    }

    if ("preparation" in data) {
      formattedUser.preparation = data.preparation;
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
    <>
      <section className="auth auth--editProfile">
        <h1 className="auth__title">{t("profile.editProfile.title")}</h1>

        <div className="auth__wrapper">
          <div className="auth__content">
            {isLoading || !user || !defaultValues ? (
            <Loader />
            ) : (
              <>
                <ProfileForm
                  onSubmit={onSubmit}
                  defaultValues={defaultValues}
                  isPending={isPending}
                  type="edit"
                  validation={EditProfileValidation}
                />
                {isUserProfile && <DeleteProfileOrCompetition type="profile"/>}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;
