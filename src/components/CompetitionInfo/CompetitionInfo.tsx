import {FC} from "react";
import './CompetitionInfo.scss';
import {useUserContext} from "../../context/AuthContext.tsx";
import {calculateDays, formatDate} from "../../lib/utils.ts";

type CompetitionInfoProps = {
    data: ISingleCompetition;
}

const CompetitionInfo: FC<CompetitionInfoProps> = ({data}) => {
    const {user} = useUserContext();
    return (
        <div className={"competition-info"}>
            <h2 className="competition-info__title">{data.name}</h2>
            <div className="competition-info__info">
                <div className="competition-info__row">
                    <span className="competition-info__text">Создатель турнира:</span>
                    <span className="competition-info__text">{data.trainer.last_name} {data.trainer.first_name}</span>
                </div>
                <div className="competition-info__row">
                    <span className="competition-info__text">Краткое описание турнира:</span>
                    <span className="competition-info__text">{data.description}</span>
                </div>
                <div className="competition-info__row">
                    <span className="competition-info__text">Дата проведения:</span>
                    <span className="competition-info__text">{formatDate(data.days[0].date)}</span>
                </div>
                <div className="competition-info__row">
                    <span className="competition-info__text">Время проведения:</span>
                    <span className="competition-info__text">{data.days[0].start_time}-{data.days[0].end_time}</span>
                </div>
                <div className="competition-info__row">
                    <span className="competition-info__text">Количество туров:</span>
                    <span className="competition-info__text">{data.tours}</span>
                </div>
                <div className="competition-info__row">
                    <span className="competition-info__text">Допустимый возраст игроков:</span>
                    <span className="competition-info__text">{data.age}</span>
                </div>
                <div className="competition-info__row">
                    <span className="competition-info__text">Формат:</span>
                    <span className="competition-info__text">{data.size}x{data.size}</span>
                </div>
            </div>
            <div className="competition-info__wrapper">
                {user && user.role_id === 1 && (<button className="competition-info__edit">Редактировать</button>)}
                <span className="competition-info__closes-at">{calculateDays(data.closes_at)}</span>
            </div>
        </div>
    );
}

export default CompetitionInfo;