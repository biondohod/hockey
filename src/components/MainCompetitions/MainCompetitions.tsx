import { useEffect, useLayoutEffect, useState } from "react";
import "./MainCompetitions.scss";
import { useGetCompetitions } from "../../lib/react-query/queries";
import { useTranslation } from "react-i18next";
import MainCompetitoinItem from "./MainCompetitoinItem";
import Loader from "../Loader/Loader";

const MainCompetitions = () => {
  const [competitionsList, setCompetitionsList] = useState<{
    competitions: ICompetition[];
    offset: number;
  }>({ competitions: [], offset: 0 });
  const [offset, setOffset] = useState(0);
  const [isCanLoadMore, setIsCanLoadMore] = useState(true);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetCompetitions(offset, 3);
  const { t } = useTranslation();
  const [totalCompetitions, setTotalCompetitions] = useState(0);

  useEffect(() => {
    if (data)
      setCompetitionsList((prev) => {
        if (competitionsList.competitions.length === 0) {
          return { competitions: data.competitions, offset: offset };
        }
        console.log(offset, prev.offset);
        console.log(prev)
        if (offset > prev.offset) {
          return {
            competitions: [...prev.competitions, ...data.competitions],
            offset: offset,
          };
        }
        return prev;
      });
  }, [data]);

  useEffect(() => {
    if (data && data.total <= competitionsList.competitions.length) {
      setIsCanLoadMore(false);
    } else {
      setIsCanLoadMore(true);
    }
  }, [data, competitionsList]);

  useEffect(() => {
    refetch();
  }, [offset]);

  const loadMore = () => {
    setOffset((prev) => prev + 3);
  };

  return (
    <section className="main-competitions">
      <h2 className="main-competitions__title">Турниры</h2>
      <div className="main-competitions__content">
        <ul className="main-competitions__list">
          {competitionsList.competitions.map((competition) => (
            <MainCompetitoinItem
              key={competition.id}
              competition={competition}
            />
          ))}
        </ul>
        {isLoading && <Loader />}
        {isCanLoadMore && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="main-competitions__load-more"
          >
            {t("competitions.loadMore")}
          </button>
        )}
      </div>
    </section>
  );
};

export default MainCompetitions;
