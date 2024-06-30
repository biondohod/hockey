import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetCompetition,
  useGetUserRegistrations,
} from "../../../lib/react-query/queries";
import CompetitionInfo from "../../../components/CompetitionInfo/CompetitionInfo.tsx";
import "./Competition.scss";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Loader/Loader.tsx";
import EmptyContent from "../../../components/EmptyElement/EmptyElement.tsx";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  useCancelRegistration,
  useRegisterForCompetition,
} from "../../../lib/react-query/mutations.ts";
import { useUserContext } from "../../../context/AuthContext.tsx";
import CompetitionRegistrations from "../../../components/CompetitionRegistrations/CompetitionRegistrations.tsx";
import CompetitionSchedule from "../../../components/CompetitionSchedule/CompetitionSchedule.tsx";
import CompetitionPlayers from "../../../components/CompetitionPlayers/CompetitionPlayers.tsx";

const Competition = () => {
  const { id, type } = useParams();
  const COMPETITION_TABS = ["info", "players", "games", "table"];
  const parsedId = id ? parseInt(id) : undefined;
  const [selectedType, setSelectedType] = useState("info");
  const { user, isAdmin } = useUserContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: register, isPending: isRegistering } =
    useRegisterForCompetition();
  const { mutateAsync: cancelRegistration, isPending: isCancelling } =
    useCancelRegistration();
  const userId = typeof user?.id === "string" ? parseInt(user?.id) : user?.id;
  const { data: userRegistrations, isLoading: isUserRegistrationsLoading } =
    useGetUserRegistrations(userId);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  // Call the hook at the top level
  const { data, isLoading, isError, error } = useGetCompetition(parsedId);

  useEffect(() => {
    if (type && COMPETITION_TABS.includes(type)) {
      setSelectedType(type);
    } else {
      navigate(`/competition/${id}/info`);
    }

    // console.log(data)
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

  useEffect(() => {
    if (userRegistrations) {
      const competiton = userRegistrations.registrations.find(
        (registration) => registration.competition.id === parsedId
      );
      if (competiton) {
        setIsRegistered(true);
        setIsApproved(competiton.is_approved);
        setIsDropped(competiton.is_dropped);
      } else {
        setIsRegistered(false);
        setIsApproved(false);
        setIsDropped(false);
      }
    }
  }, [userRegistrations]);

  const onRegister = async (id: number) => {
    toast.promise(register(id), {
      pending: t("competitions.register.pending"),
    });
  };

  const onCancelRegistration = async (id: number) => {
    toast.promise(cancelRegistration(id), {
      pending: t("competitions.register.cancelPending"),
    });
  };

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
        return (
          <>
            <CompetitionInfo data={data} />
            {checkIsAwailableForRegistration() && (
              <div className="competition__registation">
                {renderRegisrationButtons()}
              </div>
            )}
          </>
        );
      case "players":
        return <CompetitionPlayers competitionId={data.id} />;
      case "games":
        return <CompetitionSchedule competitionId={data.id} />;
      case "table":
        return (
          <EmptyContent message={t("competitions.competition.emptyCategory")} />
        );
      default:
        return <EmptyContent />;
    }
  };

  const checkIsAwailableForRegistration = () => {
    if (
      !data ||
      isLoading ||
      isError ||
      (user?.role_id !== 4 && user?.role_id !== 5)
    )
      return false;
    const currentDate = new Date();
    const closesAt = new Date(data.closes_at);
    return currentDate < closesAt;
  };

  const renderRegisrationButtons = () => {
    let button: JSX.Element | null = null;
    let text: JSX.Element | null = null;
    const isAvailable = checkIsAwailableForRegistration();
    if (isAvailable) {
      if (isDropped)
        text = <span>{t("competitions.competition.dropped")}</span>;
      else if (!isRegistered) {
        text = <span>{t("competitions.competition.notRegistered")}</span>;
        button = (
          <button
            className="competition__registrate"
            onClick={() => onRegister(data!.id)}
            disabled={isRegistering}
          >
            {t("competitions.competition.registrate")}
          </button>
        );
      } else if (isRegistered && isApproved) {
        text = <span>{t("competitions.competition.approved")}</span>;
        button = (
          <button
            className="competition__cancel-registrate"
            onClick={() => onCancelRegistration(data!.id)}
            disabled={isCancelling}
          >
            {t("competitions.competition.cancelRegistrate")}
          </button>
        );
      } else if (isRegistered && !isApproved) {
        text = <span>{t("competitions.competition.notApproved")}</span>;
        button = (
          <button
            className="competition__cancel-registrate"
            onClick={() => onCancelRegistration(data!.id)}
            disabled={isCancelling}
          >
            {t("competitions.competition.cancelRegistrate")}
          </button>
        );
      }
    }
    return (
      <>
        {text}
        {button}
      </>
    );
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
          to={`/competition/${id}/games?limit=10&offset=0`}
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
      {/* {checkIsAwailableForRegistration() && (
        <div className="competition__registation">
          {renderRegisrationButtons()}
        </div>
      )} */}
    </section>
  );
};

export default Competition;
