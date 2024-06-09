import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetCompetition } from "../../../lib/react-query/queries";
import CompetitionInfo from "../../../components/CompetitionInfo/CompetitionInfo.tsx";
import "./Competition.scss";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Loader/Loader.tsx";
import EmptyContent from "../../../components/EmptyElement/EmptyElement.tsx";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useCancelRegistration, useRegisterForCompetition } from "../../../lib/react-query/mutations.ts";

const Competition = () => {
  const { id, type } = useParams();
  const COMPETITION_TABS = ["info", "players", "games", "table"];
  const parsedId = id ? parseInt(id) : undefined;
  const [selectedType, setSelectedType] = useState("info");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {mutateAsync: register, isPending: isRegistering} = useRegisterForCompetition();
  const {mutateAsync: cancelRegistration, isPending: isCancelling} = useCancelRegistration();

  // Call the hook at the top level
  const { data, isLoading, isError, error } = useGetCompetition(parsedId);

  useEffect(() => {
    if (type && COMPETITION_TABS.includes(type)) {
      setSelectedType(type);
    } else {
      navigate(`/competition/${id}/info`);
    }
    console.log(data);
  }, [id, data]);

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

  const renderTabContent = () => {
    if (isLoading) return <Loader fontSize={32} />;

    if (isError)
      return <EmptyContent message={t("competitions.competition.error")} />;

    if (!data)
      return (
        <EmptyContent message={t("competitions.competition.emptyContent")} />
      );

    switch (selectedType) {
      case "info":
        return <CompetitionInfo data={data} />;
      case "players":
        return (
          <EmptyContent message={t("competitions.competition.emptyCategory")} />
        );
      case "games":
        return (
          <EmptyContent message={t("competitions.competition.emptyCategory")} />
        );
      case "table":
        return (
          <EmptyContent message={t("competitions.competition.emptyCategory")} />
        );
      default:
        return (
          <EmptyContent/>
        );
    }
  };

  return (
    <section className="competitions">
      <h1 className="competitions__title">
        {t(`competitions.competition.${selectedType}`)}
      </h1>
      <div className="competitions__tabs competitions__tabs--competition">
        <Link
          to={`/competition/${id}/info`}
          className={`competitions__tab ${
            selectedType === "info" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("info")}
        >
          {t("competitions.competition.info")}
        </Link>
        <Link
          to={`/competition/${id}/players`}
          className={`competitions__tab ${
            selectedType === "players" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("players")}
        >
          {t("competitions.competition.players")}
        </Link>
        <Link
          to={`/competition/${id}/games`}
          className={`competitions__tab ${
            selectedType === "games" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("games")}
        >
          {t("competitions.competition.games")}
        </Link>
        <Link
          to={`/competition/${id}/table`}
          className={`competitions__tab ${
            selectedType === "table" ? "competitions__tab--active" : ""
          }`}
          onClick={() => setSelectedType("table")}
        >
          {t("competitions.competition.table")}
        </Link>
      </div>

      <div className={"competition__content"}>{renderTabContent()}</div>
      {!isLoading && !isError && data && (
        <div className="competition__registation">
          <button className="competition__registrate" onClick={() => register(data.id)} disabled={isRegistering}>
            {t("competitions.competition.registrate")}
          </button>
          <button className="competition__cancel-registrate" onClick={() => cancelRegistration(data.id)} disabled={isCancelling}>
            {t("competitions.competition.cancelRegistrate")}
          </button>
        </div>
      )}
    </section>
  );
};

export default Competition;
