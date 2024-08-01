import { FC } from "react";
import { formatDate } from "../../lib/utils";
import { Link } from "react-router-dom";

type MainCompetitionItemProps = {
  competition: ICompetition;
};
const MainCompetitoinItem: FC<MainCompetitionItemProps> = ({competition}) => {
  return (
    <li className="main-competitions__item">
      <img
        src="/assets/img/gray.png"
        alt="Превью турнира."
        className="main-competitions__img"
      />
      <Link to={`competition/${competition.id}/info`} target="_blank" className="main-competitions__name">{competition.name}</Link>
      <span className="main-competitions__date">{formatDate(competition.closes_at)}</span>
    </li>
  );
};

export default MainCompetitoinItem;
