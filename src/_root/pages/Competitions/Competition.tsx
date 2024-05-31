import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetCompetition} from "../../../lib/react-query/queries";
import CompetitionInfo from "../../../components/CompetitionInfo/CompetitionInfo.tsx";
import './Competition.scss'

enum COMPETITION_TABS {
    "info" = "Информация о турнире",
    "players" = "Список игроков(временно не работает)",
    "games" = "Расписание матчей(временно не работает)",
    "table" = "Сводная таблица(временно не работает)",
}

const Competition = () => {
    const {id, type} = useParams();
    // Parse the id outside the condition
    const parsedId = id ? parseInt(id) : undefined;
    const [selectedType, setSelectedType] = useState(COMPETITION_TABS["info"]);
    const navigate = useNavigate();

    // Call the hook at the top level
    const {data} = useGetCompetition(parsedId);

    useEffect(() => {
        if (type && type in COMPETITION_TABS) {
            setSelectedType(COMPETITION_TABS[type as keyof typeof COMPETITION_TABS]);
        } else {
            navigate(`/competition/${id}/info`);
        }
        console.log(data);
    }, [id, data]);

    const renderTabContent = () => {
        switch (selectedType) {
            case COMPETITION_TABS["info"]:
                return <CompetitionInfo data={data}/>;
            case COMPETITION_TABS["players"]:
                return <div>Эта вкладка временно не работает :(</div>;
            case COMPETITION_TABS["games"]:
                return <div>Эта вкладка тоже временно не работает :(</div>;
            case COMPETITION_TABS["table"]:
                return <div>И эта вкладка временно не работает :(</div>;
            default:
                return <div>Пока нет информации</div>;
        }
    }

    return (<section className="competitions">
        <h1 className="competitions__title">{selectedType}</h1>
        <div className="competitions__tabs competitions__tabs--competition">
            <Link
                to={`/competition/${id}/info`}
                className={`competitions__tab ${
                    selectedType === COMPETITION_TABS["info"] ? "competitions__tab--active" : ""
                }`}
                onClick={() => setSelectedType(COMPETITION_TABS["info"])}
            >
                Информация о турнире
            </Link>
            <Link
                to={`/competition/${id}/players`}
                className={`competitions__tab ${
                    selectedType === COMPETITION_TABS["players"] ? "competitions__tab--active" : ""
                }`}
                onClick={() => setSelectedType(COMPETITION_TABS["players"])}
            >
                Список игроков
            </Link>
            <Link
                to={`/competition/${id}/games`}
                className={`competitions__tab ${
                    selectedType === COMPETITION_TABS["games"] ? "competitions__tab--active" : ""
                }`}
                onClick={() => setSelectedType(COMPETITION_TABS["games"])}
            >
                Расписание матчей
            </Link>
            <Link
                to={`/competition/${id}/table`}
                className={`competitions__tab ${
                    selectedType === COMPETITION_TABS["table"] ? "competitions__tab--active" : ""
                }`}
                onClick={() => setSelectedType(COMPETITION_TABS["table"])}
            >
                Сводная таблица
            </Link>
        </div>

        {!data ? <div>Пока нет информации</div> : (
            <div className={"competition__content"}>{renderTabContent()}</div>)}

        <div className="competition__registation">
            <button className="competition__registrate">Учавствовать</button>
            <button className="competition__cancel-registrate">Отменить участие</button>
        </div>

    </section>);
};

export default Competition;
