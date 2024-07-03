import { FC, useState } from "react";
import EmptyContent from "../EmptyElement/EmptyElement";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserContext } from "../../context/AuthContext";
import { useEditMatchScore } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { formatDateAndTime } from "../../lib/utils";

type CompetitionMatchProps = {
  competitionId: number;
  match: ICompetitionMatch;
  gameNumber: number;
};
const CompetitionMatch: FC<CompetitionMatchProps> = ({ competitionId, match, gameNumber }) => {
  const { t } = useTranslation();
  const { isAdmin, role } = useUserContext();
  const [leftScore, setLeftScore] = useState<number>(0);
  const [rightScore, setRightScore] = useState<number>(0);
  const {mutateAsync, isPending} = useEditMatchScore();
  const renderPlayers = (team: IMatchUser[]) => {
    if (!team.length)
      return (
        <div style={{ gridColumn: "1/-1" }}>
          {t("competitions.schedule.emptyTeam")}
        </div>
      );
    return team.map((player) => {
      return (
        <Link
          to={`/profile/${player.id}`}
          target="_blank"
          key={player.id}
          className="matches__player"
        >
          {player.name}
        </Link>
      );
    });
  };

  const onNumberInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    if (e.currentTarget.name === "left_score") {
      setLeftScore(parseInt(newValue));
    } else if (e.currentTarget.name === "right_score") {
      setRightScore(parseInt(newValue));
    }
  };

  const onNumberInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "left_score" && isNaN(leftScore)) {
      setLeftScore(0);
    } else if (e.target.name === "right_score" && isNaN(rightScore)) {
      setRightScore(0);
    }
  };

  const onEditScore = async () => {
    if (isNaN(leftScore) || isNaN(rightScore)) {
      toast.error(t("competitions.schedule.editScore.invalidScore"));
    } else {
      console.log(leftScore, rightScore)
      toast.promise(mutateAsync({competitionId, matchId: match.id, leftScore, rightScore}), {
        pending: t("competitions.schedule.editScore.pending"),
      });
    }
  }

  const renderTimeAndScore = () => {
    const { date, time } = formatDateAndTime(match.start_time, true);
    let matchesScore;
    if (match.left_score !== null && match.right_score !==null) {
      matchesScore = (
        <span className="matches__score">
          {match.left_score} : {match.right_score}
        </span>
      );
    } else {
      if (isAdmin || role?.name === "Судья") {
        matchesScore = (
          <div className="matches__form">
            <span className="matches__score--set-unknown">{t("competitions.schedule.setUnknownScore")}</span>
            <div className="matches__inputs-wrapper">
              <input
                type="number"
                name="left_score"
                id="left_score"
                min={0}
                value={leftScore}
                onInput={onNumberInputChange}
                onBlur={onNumberInputBlur}
                className="matches__input"
              />
              <input
                type="number"
                name="right_score"
                id="right_score"
                min={0}
                value={rightScore}
                onInput={onNumberInputChange}
                onBlur={onNumberInputBlur}
                className="matches__input"
              />
            </div>
            <button className="matches__set-score" disabled={isPending} onClick={onEditScore}>{t("competitions.schedule.setScore")}</button>
          </div>
        );
      } else
        matchesScore = (
          <span className="matches__score--unknown">
            {t("competitions.schedule.unknownScore")}
          </span>
        );
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
        <span className="matches__name">
          {t("competitions.schedule.game")} {gameNumber}
        </span>
        {/* <span className="matches__score">{3} : {1}</span> */}
        {matchesScore}
      </div>
    );
  };

  return (
    <li className="matches__item">
      <div className="matches__team matches__team--left">
        <span className="matches__team-name">
          {t("competitions.schedule.team")} 1
        </span>
        <div className="matches__players">{renderPlayers(match.left_team)}</div>
      </div>
      {renderTimeAndScore()}
      <div className="matches__team matches__team--right">
        <span className="matches__team-name">
          {t("competitions.schedule.team")} 2
        </span>
        <div className="matches__players">
          {renderPlayers(match.right_team)}
        </div>
      </div>
    </li>
  );
};

export default CompetitionMatch;
