import { useTranslation } from "react-i18next";
import ProfileCompetitions from "../../../components/ProfileCompetitoins/ProfileCompetitions";
import { useUserContext } from "../../../context/AuthContext";

const MyCompetitions = () => {
  const { user } = useUserContext();
  let parsedId: number | undefined = undefined;
  const {t} = useTranslation();

  if (user?.id) {
    parsedId = typeof user.id === "string" ? parseInt(user.id) : user.id;
  }

  if (!parsedId) return null;

  return (
    <div className="profile__competitions profile__competitions--page">
      <h2 className="profile__subtitle">{t("profile.competitions.title")}</h2>
      <ProfileCompetitions id={parsedId} />
    </div>
  );
};

export default MyCompetitions;
