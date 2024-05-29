import {useEffect, useState} from "react";
import {useGetCompetitions} from "../../../lib/react-query/queries";
import {Link, useParams} from "react-router-dom";
import './AllCompetitions.scss';
import CompetitionItem from "../../../components/CompetitionItem/CompetitionItem.tsx";

enum COMPETITION_TYPE {
    "4x4" = "Турниры 4x4",
    "6x6" = "Турниры 6x6",
    "paid" = "Платные турниры",
    "archive" = "Архив турниров",
}

const AllCompetitions = () => {
    const {type} = useParams();
    const {data} = useGetCompetitions();
    const [selectedType, setSelectedType] = useState(COMPETITION_TYPE["4x4"]);

    useEffect(() => {
        if (type) {
            setSelectedType(COMPETITION_TYPE[type as keyof typeof COMPETITION_TYPE]);
        }
    }, [type, data, selectedType]);

    const filterData = (data: ICompetition[]): ICompetition[] => {
        switch (selectedType) {
            case COMPETITION_TYPE["4x4"]:
                return data.filter((competition) => competition.size === 4);
            case COMPETITION_TYPE["6x6"]:
                return data.filter((competition) => competition.size === 6);
            case COMPETITION_TYPE["paid"]:
                return data.filter((competition) => competition.size === 4);
            case COMPETITION_TYPE["archive"]:
                return data.filter((competition) => competition.size === 6);
            default:
                return data;
        }
    };


    return (
        <section className="competitions">
            <h1 className="competitions__title">{selectedType}</h1>
            <div className="competitions__tabs">
                <Link
                    to={`/AllCompetitions/4x4`}
                    className={`competitions__tab ${
                        selectedType === COMPETITION_TYPE["4x4"] ? "competitions__tab--active" : ""
                    }`}
                    onClick={() => setSelectedType(COMPETITION_TYPE["4x4"])}
                >
                    Турниры 4x4
                </Link>
                <Link
                    to={`/AllCompetitions/6x6`}
                    className={`competitions__tab ${
                        selectedType === COMPETITION_TYPE["6x6"] ? "competitions__tab--active" : ""
                    }`}
                    onClick={() => setSelectedType(COMPETITION_TYPE["6x6"])}
                >
                    Турниры 6x6
                </Link>
                <Link
                    to={`/AllCompetitions/paid`}
                    className={`competitions__tab ${
                        selectedType === COMPETITION_TYPE["paid"] ? "competitions__tab--active" : ""
                    }`}
                    onClick={() => setSelectedType(COMPETITION_TYPE["paid"])}
                >
                    Платные турниры
                </Link>
                <Link
                    to={`/AllCompetitions/archive`}
                    className={`competitions__tab ${
                        selectedType === COMPETITION_TYPE["archive"] ? "competitions__tab--active" : ""
                    }`}
                    onClick={() => setSelectedType(COMPETITION_TYPE["archive"])}
                >
                    Архив турниров
                </Link>
            </div>

            {!data ? <div>Пока нет соревнований</div> : (
                <ul className="competitions__list">
                    {filterData(data)?.map((competition: ICompetition) => (
                        <CompetitionItem competition={competition}/>
                    ))}
                </ul>
            )}

        </section>
    );
};

export default AllCompetitions;
