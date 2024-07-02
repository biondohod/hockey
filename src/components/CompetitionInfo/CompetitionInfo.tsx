import { FC } from "react";
import "./CompetitionInfo.scss";
import { useUserContext } from "../../context/AuthContext.tsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CompetitionRegistrations from "../CompetitionRegistrations/CompetitionRegistrations.tsx";
import { calculateDays, getDataRange, transliterateText } from "../../lib/utils.tsx";

type CompetitionInfoProps = {
  data: ISingleCompetition;
};

const CompetitionInfo: FC<CompetitionInfoProps> = ({ data }) => {
  const { user, isAdmin } = useUserContext();
  const { t } = useTranslation();
  return (
    <>
      <div className={"competition-info"}>
        <h2 className="competition-info__title">
          {transliterateText(data.name)}
        </h2>
        <div className="competition-info__info">
          <div className="competition-info__row">
            <span className="competition-info__text">
              {t("competitions.competition.infoTab.creator")}:
            </span>
            <span className="competition-info__text">
              {transliterateText(
                `${data.trainer.last_name} ${data.trainer.first_name}`
              )}
            </span>
          </div>
          <div className="competition-info__row">
            <span className="competition-info__text">
              {t("competitions.competition.infoTab.description")}:
            </span>
            <span className="competition-info__text">{data.description}</span>
          </div>
          <div className="competition-info__row">
            <span className="competition-info__text">
              {t("competitions.competition.infoTab.date")}:
            </span>
            <span className="competition-info__text">
              {getDataRange(
                data.days[0].date,
                data.days[data.days.length - 1].date
              )}
            </span>
          </div>
          {/* <div className="competition-info__row">
                    <span className="competition-info__text">{t("competitions.competition.infoTab.time")}:</span>
                    <span className="competition-info__text">{data.days[0].start_time}-{data.days[0].end_time}</span>
                </div> */}
          <div className="competition-info__row">
            <span className="competition-info__text">
              {t("competitions.competition.infoTab.tours")}:
            </span>
            <span className="competition-info__text">{data.tours}</span>
          </div>
          <div className="competition-info__row">
            <span className="competition-info__text">
              {t("competitions.competition.infoTab.age")}:
            </span>
            <span className="competition-info__text">{data.age}</span>
          </div>
          <div className="competition-info__row">
            <span className="competition-info__text">
              {t("competitions.competition.infoTab.format")}:
            </span>
            <span className="competition-info__text">
              {data.size}x{data.size}
            </span>
          </div>
        </div>
        <div className="competition-info__wrapper">
          {user && user.role_id === 1 && (
            <Link
              to={`/editCompetition/${data.id}`}
              className="competition-info__edit"
            >
              {t("competitions.competition.infoTab.edit")}
            </Link>
          )}
          <span className="competition-info__closes-at">
            {calculateDays(data.closes_at)}
          </span>
        </div>
      </div>
      {isAdmin && data && <CompetitionRegistrations competitionId={data.id} />}
    </>
  );
};

export default CompetitionInfo;
