import { FC } from "react";
import { formatDate, transliterateText } from "../../lib/utils.ts";
import { Link } from "react-router-dom";
import "./CompetitionItem.scss";
import { useTranslation } from "react-i18next";

type CompetitionItemProps = {
  competition: ICompetition;
  is_approved?: boolean;
  is_dropped?: boolean;
};
const CompetitionItem: FC<CompetitionItemProps> = ({
  competition,
  is_approved,
  is_dropped,
}) => {
  const { t } = useTranslation();
  const getCompetitionStatus = (closes_at: string) => {
    const closesAtDate = new Date(closes_at);
    const today = new Date();

    // Reset the time part of the dates to compare only the date part
    closesAtDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (closesAtDate > today) {
      return (
        <span style={{ color: "#0085FF" }}>
          {t("competitions.competitionItem.status.planned")}
        </span>
      );
    } else if (closesAtDate.getTime() === today.getTime()) {
      return (
        <span style={{ color: "#FF9417" }}>
          {t("competitions.competitionItem.status.ongoing")}
        </span>
      );
    } else {
      return (
        <span style={{ color: "#1AD638" }}>
          {t("competitions.competitionItem.status.finished")}
        </span>
      );
    }
  };

  let registrationStatus: string | null = null;

  if (is_approved !== undefined && is_dropped !== undefined) {
    if (is_approved) {
      registrationStatus = "approved";
    } else if (!is_approved) {
      registrationStatus = "not approved";
    }
    if (is_dropped) {
      registrationStatus = "dropped";
    }
  }

  return (
    <li className="competitions__item">
      <div className={"competitions__wrapper"}>
        <h2 className="competitions__name">
          {transliterateText(competition.name)},{" "}
          {t("competitions.competitionItem.trainer")}:{" "}
          {transliterateText(
            `${competition.trainer.last_name} ${competition.trainer.first_name} ${competition.trainer.middle_name}`
          )}{" "}
        </h2>
        <div className="competitions__state">
          <p className="competitions__date">
            {t("competitions.competitionItem.closes_at")}:{" "}
            {formatDate(competition.closes_at)}
          </p>
          <div className="competitions__status">
            {t("competitions.competitionItem.status.title")}:{" "}
            {getCompetitionStatus(competition.closes_at)}
          </div>
        </div>
        <p className="competitions__description">{competition.description}</p>
        {/* {registrationStatus && (
          <div className="profile-competition__registration">
            <span className="profile-comeptition__text">
              Ваш статус регистрации на турнир{" "}
            </span>
            <span className="profile-comeptition__status">
              {registrationStatus}
            </span>
          </div>
        )} */}
      </div>
      <Link
        to={`/competition/${competition.id}/info`}
        className="competitions__btn"
      >
        {t("competitions.competitionItem.about")}
      </Link>
    </li>
  );
};

export default CompetitionItem;
