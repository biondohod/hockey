import { FC } from "react";
import EmptyContent from "../EmptyElement/EmptyElement";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDateAndTime } from "../../lib/utils";

type CompetitionMatchProps = {
  match: ICompetitionMatch;
  gameNumber: number;
};
const CompetitionMatch: FC<CompetitionMatchProps> = ({ match, gameNumber }) => {
  const {t} = useTranslation();
  const renderPlayers = (team: IUser[]) => {
    if (!team.length)
      return (
        <div style={{ gridColumn: "1/-1" }}>
          {t("competitions.schedule.emptyTeam")}
        </div>
      );
    return team.map((player) => {
      return (
        <Link to={`/profile/${player.id}`} target="_blank" key={player.id} className="matches__player">
          {player.first_name} {player.last_name}
        </Link>
      );
    });
  };



  const renderTimeAndScore = () => {
    const { date, time } = formatDateAndTime(match.start_time, true);
    let matchesScore;
    if (match.left_score && match.right_score) {
      matchesScore = <span className="matches__score">{match.left_score} : {match.right_score}</span>
    } else {
      matchesScore = <span className="matches__score--unknown">{t("competitions.schedule.unknownScore")}</span>
    }
    // const matchesScore =
    //   match.left_score && match.right_score
    //     ? `${match.left_score} : ${match.right_score}`
    //     : "Счет матча еще не известен";
    return (
      <div className="matches__info">
        <div className="matches__date">
          <span className="matches__day">{date}</span>
          <span className="matches__time">{time}</span>
        </div>
        <span className="matches__name">{t("competitions.schedule.game")} {gameNumber}</span>
        {/* <span className="matches__score">{3} : {1}</span> */}
        {matchesScore}
      </div>
    );
  };

  return (
    <li className="matches__item">
      <div className="matches__team matches__team--left">
        <span className="matches__team-name">{t("competitions.schedule.team")} 1</span>
        <div className="matches__players">{renderPlayers(match.left_team)}</div>
      </div>
      {renderTimeAndScore()}
      <div className="matches__team matches__team--right">
        <span className="matches__team-name">{t("competitions.schedule.team")} 2</span>
        <div className="matches__players">
          {renderPlayers(match.right_team)}
        </div>
      </div>
    </li>
  );
};

export default CompetitionMatch;
