import { useEffect, useState } from "react";
import { useGetCompetitions } from "../../../lib/react-query/queries";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AllCompetitions.scss";
import CompetitionItem from "../../../components/CompetitionItem/CompetitionItem.tsx";
import { useTranslation } from "react-i18next";
import EmptyContent from "../../../components/EmptyElement/EmptyElement.tsx";
import Loader from "../../../components/Loader/Loader.tsx";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const COMPETITION_TYPES = ["4x4", "6x6", "paid", "archive"];

/**
 * 
 * @returns {JSX.Element} Функциональный компонент, возвращающий разметку страницы "Все соревнования", которая содержит внутри табы для переключения типов сореваниваний
 */
const AllCompetitions = (): JSX.Element => {
  const { t } = useTranslation();
  const { type } = useParams();
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);
  const [competitionsList, setCompetitionsList] = useState<ICompetition[]>([]);
  const [selectedType, setSelectedType] = useState("4x4");

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetCompetitions(offset);

  useEffect(() => {
    if (type && COMPETITION_TYPES.includes(type)) {
      setSelectedType(type);
    } else {
      navigate("/AllCompetitions/4x4");
    }
  }, [type]);

  useEffect(() => {
    if (isError) {
      const axiosError: AxiosError<ErrorResponse> =
        error as AxiosError<ErrorResponse>;
      const errorMessage = t("global.axios.error", {
        message:
          axiosError.response?.data?.message ||
          t("global.axios.unknownErrorMessage"),
      });
      toast.error(errorMessage);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data)
      setCompetitionsList(data.competitions);
    if (data && data.total < competitionsList.length) {
      setOffset(0);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [offset]);

  const onLoadMore = () => {
    setOffset((prev) => prev + 10);
  };

  const filterData = (data: ICompetition[]): ICompetition[] => {
    switch (selectedType) {
      case "4x4":
        return filterByData(
          data.filter((competition) => competition.size === 4),
          "notArchive"
        );
      case "6x6":
        return filterByData(
          data.filter((competition) => competition.size === 6),
          "notArchive"
        );
      case "paid":
        return [];
      case "archive":
        return filterByData(data, "archive");
      default:
        return data;
    }
  };

  const filterByData = (
    data: ICompetition[],
    type: "archive" | "notArchive"
  ): ICompetition[] => {
    return data.filter((competition) => {
      const closesAtDate = new Date(competition.closes_at);
      const today = new Date();

      closesAtDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (type === "archive") {
        return closesAtDate < today;
      } else {
        return closesAtDate >= today;
      }
    });
  };

  const renderCompetitions = (data: ICompetition[]) => {
    if (isLoading) return <Loader fontSize={32} />;

    if (isError && !data)
      return <EmptyContent message={t("competitions.error")} fontSize={32} />;

    if (!data)
      return (
        <EmptyContent
          message={t("competitions.emptyContent")}
          marginTop={32}
          fontSize={32}
        />
      );

    const filtredData = filterData(data);

    if (filtredData.length === 0) {
      return (
        <EmptyContent message={t("competitions.emptyCategory")} fontSize={32} />
      );
    }

    return filtredData.map((competition: ICompetition) => (
      <CompetitionItem key={competition.id} competition={competition} />
    ));
  };

  return (
    <section className="competitions">
      <h1 className="competitions__title">
        {t(`competitions.${selectedType}`)}
      </h1>
      <div className="competitions__tabs">
        <Link
          to={`/AllCompetitions/4x4`}
          className={`competitions__tab ${
            selectedType === "4x4" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("4x4")}
        >
          {t("competitions.4x4")}
        </Link>
        <Link
          to={`/AllCompetitions/6x6`}
          className={`competitions__tab ${
            selectedType === "6x6" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("6x6")}
        >
          {t("competitions.6x6")}
        </Link>
        <Link
          to={`/AllCompetitions/paid`}
          className={`competitions__tab ${
            selectedType === "paid" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("paid")}
        >
          {t("competitions.paid")}
        </Link>
        <Link
          to={`/AllCompetitions/archive`}
          className={`competitions__tab ${
            selectedType === "archive" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("archive")}
        >
          {t("competitions.archive")}
        </Link>
      </div>

      {
        <ul className="competitions__list">
          {renderCompetitions(competitionsList)}
        </ul>
      }
      {data &&
        competitionsList.length &&
        data.total !== competitionsList.length && (
          <button
            className="competitions__btn competitions__btn--load-more"
            onClick={onLoadMore}
            disabled={isFetching}
          >
            {t("competitions.loadMore")}
          </button>
        )}
      {data &&
        competitionsList.length &&
        data.total === competitionsList.length && competitionsList.length > 10 && (
          <button
            className="competitions__btn competitions__btn--load-more"
            onClick={onLoadMore}
            disabled={isFetching}
          >
            В начало
          </button>
        )}
    </section>
  );
};

export default AllCompetitions;
