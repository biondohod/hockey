import { FC, useEffect, useState } from "react";
import { useGetUserRegistrations } from "../../lib/react-query/queries";
import Loader from "../Loader/Loader";
import EmptyContent from "../EmptyElement/EmptyElement";
import CompetitionItem from "../CompetitionItem/CompetitionItem";
import { useTranslation } from "react-i18next";

type ProfileCompetitionsProps = {
  id: number;
};
const ProfileCompetitions: FC<ProfileCompetitionsProps> = ({ id }) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const { data, isLoading, isError, refetch, isFetching } = useGetUserRegistrations(
    id,
    offset,
    limit
  );
  const {t} = useTranslation();

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [offset]);

  const renderCompetitions = () => {
    if (isLoading || isFetching) return <Loader />;
    if (isError) return <EmptyContent message={t("competitions.profile.error")} />;
    if (!data || !data.registrations || data.registrations.length === 0)
      return <EmptyContent message={t("competitions.profile.empty")} />;
    return data.registrations.map((registration) => (
      <CompetitionItem
        key={registration.competition.id}
        competition={registration.competition}
        is_approved={registration.is_approved}
        is_dropped={registration.is_dropped}
      />
    ));
  };

  const renderPagination = () => {
    if (!data || !data.registrations?.length || isError) return <></>;
    const pages = Math.ceil(data!.total / limit);
    const currentPage = Math.ceil(offset / limit + 1);
    const pagination = [];
    for (let i = 1; i <= pages; i++) {
      pagination.push(
        <button
          key={i}
          onClick={() => {
            setOffset(((i - 1) * limit));
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

  return (
    <>
      {<ul className="competitions__list competitions__list--profile">{renderCompetitions()}</ul>}{" "}
      <div className="schedule__pagination">{renderPagination()}</div>
    </>
  );
};

export default ProfileCompetitions;
