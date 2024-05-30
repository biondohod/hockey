import {useEffect, useState} from "react";
import {useGetCompetitions} from "../../../lib/react-query/queries";
import {Link, useNavigate, useParams} from "react-router-dom";
import './AllCompetitions.scss';
import CompetitionItem from "../../../components/CompetitionItem/CompetitionItem.tsx";

enum COMPETITION_TYPE {
    "4x4" = "Турниры 4x4",
    "6x6" = "Турниры 6x6",
    "paid" = "Платные турниры (временно не работает)",
    "archive" = "Архив турниров",
}

const AllCompetitions = () => {
    const {type} = useParams();
    const {data} = useGetCompetitions();
    const [selectedType, setSelectedType] = useState(COMPETITION_TYPE["4x4"]);
    const navigate = useNavigate();

    useEffect(() => {
        if (type && type in COMPETITION_TYPE) {
            setSelectedType(COMPETITION_TYPE[type as keyof typeof COMPETITION_TYPE]);
        } else {
            navigate('/AllCompetitions/4x4');
        }
    }, [type, data, selectedType, navigate]);

    const filterData = (data: ICompetition[]): ICompetition[] => {
        switch (selectedType) {
            case COMPETITION_TYPE["4x4"]:
                return filterByData(data.filter((competition) => competition.size === 4), "notArchive");
            case COMPETITION_TYPE["6x6"]:
                return filterByData(data.filter((competition) => competition.size === 6), "notArchive");
            case COMPETITION_TYPE["paid"]:
                return filterByData(data.filter((competition) => competition.size === 4), "notArchive");
            case COMPETITION_TYPE["archive"]:
                return filterByData(data, "archive");
            default:
                return data;
        }
    };

    const filterByData = (data: ICompetition[], type: "archive" | "notArchive"): ICompetition[] => {
        return data.filter((competition) => {
            const closesAtDate = new Date(competition.closes_at);
            const today = new Date();

            // Reset the time part of the dates to compare only the date part
            closesAtDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (type === "archive") {
                return closesAtDate < today;
            } else {
                return closesAtDate >= today;
            }
        });
    }


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
                        <CompetitionItem key={competition.id} competition={competition}/>
                    ))}
                </ul>
            )}

        </section>
    );
};

export default AllCompetitions;
