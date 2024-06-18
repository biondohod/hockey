import { FC, useEffect, useState } from "react";
import "./CompetitionSchedule.scss";
import { useGetCompetitionMatches } from "../../lib/react-query/queries";
import { useSearchParams, useNavigate } from "react-router-dom";
import CompetitionMatch from "./CompetitionMatch";
import { set } from "react-hook-form";
import Loader from "../Loader/Loader";
import EmptyContent from "../EmptyElement/EmptyElement";
import { useTranslation } from "react-i18next";

type CompetitionScheduleProps = {
  competitionId: number;
};

const CompetitionSchedule: FC<CompetitionScheduleProps> = ({
  competitionId,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState<string>(searchParams.get("limit") || "10");
  const [offset, setOffset] = useState<string>(
    searchParams.get("offset") || "0"
  );
  // const limit = searchParams.get("limit") || "";
  // const offset = searchParams.get("offset") || "";
  const { data, refetch, isFetching, isLoading, isError } =
    useGetCompetitionMatches(competitionId, offset, limit);
  const [competitionMatches, setCompetitionMatches] = useState<
    ICompetitionMatches | undefined
  >(undefined);
  const {t} = useTranslation();

  useEffect(() => {
    {
      validateParams(limit, offset);
    }
  }, []);

  useEffect(() => {
    if (data) {
      checkIfPageExists(offset, data.total);
      setCompetitionMatches(data);
    }
  }, [data]);

  useEffect(() => {
    setSearchParams({
      limit,
      offset,
    });
    refetch();
  }, [limit, offset]);

  // useEffect(() => {
  //   if (data) {
  //     checkIfPageExists(offset, data.total);
  //     setCompetitionMatches(data);
  //   }
  // }, [data]);

  const validateParams = (limit: string, offset: string) => {
    // let validatedOffset: string;
    // let validatedLimit: string;
    const validateOptions = ["10", "20", "50", "100"];

    if (!isNaN(parseInt(offset))) {
      if (parseInt(offset) < 0) {
        setOffset(Math.abs(parseInt(offset)).toString());
        // validatedOffset = Math.abs(parseInt(offset)).toString();
      } else {
        setOffset(offset);
      }
    } else setOffset("0");

    if (!validateOptions.includes(limit)) {
      setLimit(validateOptions[0]);
      // validatedLimit = validateOptions[0];
    } else setLimit(limit);
    // setSearchParams({
    //   limit: limit,
    //   offset: offset,
    // });
  };

  const checkIfPageExists = (offset: string, total: number) => {
    // let validatedOffset: string;
    if (parseInt(offset) > total) {
      setOffset("0");
      // validatedOffset = "0";
      // setSearchParams({
      //   offset: validatedOffset,
      // });
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // setSearchParams({
    //   limit: e.target.value,
    //   offset: "0",
    // });
    setLimit(e.target.value);
    setOffset("0");
    // refetch();
    // navigate(`?limit=${e.target.value}&offset=0`);
  };

  const renderPagination = () => {
    const pages = Math.ceil(competitionMatches!.total / parseInt(limit));
    const currentPage = Math.ceil(parseInt(offset) / parseInt(limit) + 1);
    const pagination = [];
    for (let i = 1; i <= pages; i++) {
      pagination.push(
        <button
          key={i}
          onClick={() => {
            setOffset(((i - 1) * parseInt(limit)).toString());
          }}
          disabled={currentPage === i}
          className={`schedule__pagination-button ${
            currentPage === i ? "schedule__pagination-button--active" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return pagination;
  };

  // isFetching or isLoading
  if (isFetching) return <Loader />;

  if (isError)
    return <EmptyContent message={t("global.loadError")} />;

  if (!competitionMatches?.matches.length)
    return (
      <EmptyContent message={t("competitions.schedule.emptyContent")} />
    );

  return (
    <section className="schedule">
      <div className="schedule__filters">
        <span className="schedule__filter-name">
        {t("competitions.schedule.filterLimit")}
        </span>
        <select
          name="limit"
          id="limit"
          className="schedule__selector"
          onChange={handleLimitChange}
          defaultValue={limit}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="schedule__matches">
          <ul className="matches__list">
            {competitionMatches.matches.map((match: ICompetitionMatch, index: number) => (
              <CompetitionMatch key={match.id} match={match} gameNumber={index+parseInt(offset)+1}/>
            ))}
          </ul>
        {/* <div className="schedule__wrapper">
          {isFetching && <Loader message="Обновляем список матчей" />}
        </div> */}
        <div className="schedule__pagination">{renderPagination()}</div>
      </div>
    </section>
  );
};

export default CompetitionSchedule;
