import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";
import "./Profile.scss";
import { useEffect, useState } from "react";

import { useGetRoles, useGetUser } from "../../../lib/react-query/queries";
import Loader from "../../../components/Loader/Loader";
import EmptyContent from "../../../components/EmptyElement/EmptyElement";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import ProfileUploadDocuments from "../../../components/ProfileDocuments/ProfileUploadDocuments";
import ProfileDocuments from "../../../components/ProfileDocuments/ProfileDocuments";
import ProfileCompetitions from "../../../components/ProfileCompetitoins/ProfileCompetitions";
import {
  calculateAge,
  formatDate,
  transliterateText,
} from "../../../lib/utils";

const Profile = () => {
  const [isUserProfile, setIsUserProfile] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [userRole, setUserRole] = useState<Irole | null>(null);
  const { id } = useParams<{ id: string }>();
  const { user, role, isAdmin } = useUserContext();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const { data, isLoading, isError, error } = useGetUser(
    id,
    localStorage.getItem("token")
  );
  const { t } = useTranslation();

  // axios.get("https://proj.raitonobe.ru/api/roles", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then((response) => {
  //   console.log(response.data);
  // });

  useEffect(() => {
    if (!id) return;
    if (parseInt(id) === user?.id) {
      setIsUserProfile(true);
      setUserData(user);
      setUserRole(role);
    } else {
      setIsUserProfile(false);
      setUserData(data);
      console.log(data);
      setUserRole(
        roles?.find((role: Irole) => role.id === data?.role_id) || null
      );
    }
    if (isError) {
      const axiosError: AxiosError<ErrorResponse> =
        error as AxiosError<ErrorResponse>;
      const errorMessage = t("global.axios.error", {
        message:
          axiosError.response?.data?.message ||
          t("global.axios.unknownErrorMessage"),
      });
      toast.error(errorMessage);
    }
  }, [id, user, data, role, roles, isLoadingRoles, isError, error]);

  if (isLoading || isLoadingRoles) return <Loader marginTop={48} />;

  if ((isError || !userData) && !isLoading)
    return <EmptyContent marginTop={32} message={t("profile.emptyContent")} />;

  if (!userData || !userRole)
    return <EmptyContent marginTop={32} message={t("profile.emptyContent")} />;

  if (!userData.player) {
    // console.log(userData, userRole, isAdmin, isUserProfile)
    return (
      <section className="profile">
        <h1 className="profile__title">Профиль</h1>

        <div className="profile__content">
          <div className="profile__info">
            <div className="profile-info__wrapper">
              <img
                src="/assets/img/avatar.png"
                className="profile-info__img"
                alt="Аватар пользователя."
              />
              <div className="profile-info__name-container">
                <span className="profile-info__name">
                  {userData.first_name} {userData.last_name}
                </span>
                <span className="profile-info__role">({userRole.name})</span>
              </div>
              {(isUserProfile || isAdmin) && (
                <Link
                  to={`/editServiceProfile/${userData.id}`}
                  className="profile-info__about-btn"
                >
                  {t("profile.edit")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log(isUserProfile, isAdmin);

  return (
    <section className="profile">
      <h1 className="profile__title">{t("profile.title")}</h1>

      <div className="profile__content">
        <div className="profile__info">
          <div className="profile-info__wrapper">
            <img
              src="/assets/img/avatar.png"
              className="profile-info__img"
              alt={t("profile.avatarAlt")}
            />
            <div className="profile-info__name-container">
              <span className="profile-info__name">
                {transliterateText(userData.first_name)}{" "}
                {transliterateText(userData.last_name)}
              </span>
              <span
                className="profile-info__verification"
                style={{
                  color:
                    userRole?.name === "Неподтвержденный" ? "red" : "green",
                }}
              >
                {userRole?.name === "Неподтвержденный" ? (
                  <div className="profile-info__unverified">
                    {t("profile.unverified")}{" "}
                    <span className="profile-info__unverified-tooltip">?</span>
                    <span className="profile-info__unverified-popup">{t("profile.unverifiedPopup")}</span>
                  </div>
                ) : (
                  t("profile.verified")
                )}
              </span>
              <div className="profile-info__btns">
                {isUserProfile && (
                  <ProfileUploadDocuments />
                  // <button className="profile-info__edit">
                  //   {t("profile.uploadDocs")}
                  // </button>
                )}

                {(isUserProfile || isAdmin) && (
                  <ProfileDocuments id={userData.id.toString()} />
                  // <button className="profile-info__edit">
                  //   {t("profile.uploadDocs")}
                  // </button>
                )}
              </div>
            </div>
          </div>
          <div className="profile-info__wrapper">
            <ul className="profile-info__about-list">
              <li className="profile-info__about">
                <span className="profile-info__about-title">
                  {t("profile.birthDate")}
                </span>
                <span className="profile-info__about-value">
                  {formatDate(userData.player.birth_date) || ""}
                </span>
              </li>
              <li className="profile-info__about">
                <span className="profile-info__about-title">
                  {t("profile.age")}
                </span>
                <span className="profile-info__about-value">
                  {calculateAge(userData.player.birth_date) || ""}
                </span>
              </li>
              {/* <li className="profile-info__about">
                <span className="profile-info__about-title">
                  {t("profile.trainer")}
                </span>
                <span className="profile-info__about-value">
                  {transliterateText("Иванов И.И.")}
                </span>
              </li> */}
              {/* <li className="profile-info__about">
                <span className="profile-info__about-title">
                  {t("profile.healthStatus.title")}
                </span>
                <span className="profile-info__about-value">
                  {t("profile.healthStatus.healthy")}
                </span>
              </li> */}
              <li className="profile-info__about">
                <span className="profile-info__about-title">
                  {t("profile.sex.sex")}
                </span>
                <span className="profile-info__about-value">
                  {userData.player.is_male
                    ? t("profile.sex.male")
                    : t("profile.sex.female") || ""}
                </span>
              </li>
              {/* <li className="profile-info__about">
                <span className="profile-info__about-title">
                  {t("profile.trainingLevel.title")}
                </span>
                <span className="profile-info__about-value">
                  {t("profile.trainingLevel.2level")}
                </span>
              </li> */}
            </ul>
            {(isUserProfile || isAdmin) && (
              <Link
                to={`/editProfile/${userData.id}`}
                className="profile-info__about-btn"
              >
                {t("profile.edit")}
              </Link>
            )}
          </div>
        </div>
        <div className="profile__competitions">
          <h2 className="profile__subtitle">
            {t("profile.competitions.title")}
          </h2>
          <ProfileCompetitions id={data.id} />
          {/* <ul className="profile-tournaments__list">
            <li className="profile-tournaments__item">
              <div className="profile-tournaments__wrapper">
                <span className="profile-tournaments__name">
                  Ранее вы зарегистровались на участие в турнире (Название
                  турнира)
                </span>
                <div className="profile-tournaments__verification">
                  <span className="profile-tournaments__verification-text">
                    Подтвердить участие?
                  </span>
                  <div className="profile-tournaments__btns">
                    <button className="profile-tournaments__btn profile-tournaments__btn--yes">
                      Да
                    </button>
                    <button className="profile-tournaments__btn profile-tournaments__btn--no">
                      Нет
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul> */}
        </div>
        <div className="profile__rating">
          <h2 className="profile__subtitle">{t("profile.rating.rating")}</h2>
        </div>
      </div>
    </section>
  );
};

export default Profile;
