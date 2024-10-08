import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import {
  useGetCompeitionRegistrations,
  useGetRoles,
} from "../../lib/react-query/queries";
import "./CompetitionRegistrations.scss";
import Loader from "../Loader/Loader";
import EmptyContent from "../EmptyElement/EmptyElement";
import { toast } from "react-toastify";
import { useUpdateRegistration } from "../../lib/react-query/mutations";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUserRole } from "../../lib/utils";

type CompetitionRegistrationsProps = {
  competitionId: number;
};

const CompetitionRegistrations: FC<CompetitionRegistrationsProps> = ({
  competitionId,
}) => {
  const { data, isLoading, isError } =
    useGetCompeitionRegistrations(competitionId);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateRegistration();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();
  const {t} = useTranslation();

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (modalIsOpen && root) {
      root.style.overflow = "hidden";
    } else if (root) {
      root.style.overflow = "auto";
    }
  }, [modalIsOpen]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onSubmit = (
    playerId: number,
    competitionId: number,
    data: IUpdateRegistration
  ) => {
    toast.promise(mutateAsync({ playerId, competitionId, data }), {
      pending: t("competitions.registration.pending"),
    });
  };

  const renderRegistrations = () => {
    if (isLoading || isLoadingRoles)
      return <Loader fontSize={24} loaderHeight={40} loaderWidth={40} />;
    if (isError) return <EmptyContent />;
    if (!data || !data.length) return <EmptyContent fontSize={24} width={"100%"} minHeight={150} message="На этот турнир еще никто не подавал заявку на участие"/>;
    return (
      <ul className="competition-registrations__list">
        {data.map((registration: ICompetitionRegistration, index: any) => (
          <li className="competition-registrations__item" key={index}>
            <div className="competition-registrations__row competition-registrations__row--first">
              <Link to={`/profile/${registration.user.id}`} target="_blank" className="competition-registrations__name">{`${t("competitions.registration.name")}: ${registration.user.last_name} ${registration.user.first_name} ${registration.user.middle_name}`}</Link>
              {/* <Link to={`/profile/${registration.user.id}`} className="competition-registrations__link">Профиль игрока</Link> */}
              <span className="competition-registrations__email">{`${t("competitions.registration.email")}: ${registration.user.email}`}</span>
              <span className="competition-registrations__role">{`${t("competitions.registration.role")}: ${
                getUserRole(registration.user.role_id, roles)?.name
              }`}</span>
            </div>
            <div className="competition-registrations__row competition-registrations__row--second">
              {registration.is_approved
                ? t("competitions.registration.approved")
                : t("competitions.registration.notApproved")}
              <button
                className="competition-registrations__button competition-registrations__button--approve"
                onClick={() =>
                  onSubmit(Number(registration.user.id), competitionId, {
                    is_approved: !registration.is_approved,
                  })
                }
                disabled={isPending}
              >
                {registration.is_approved
                  ? t("competitions.registration.cancel")
                  : t("competitions.registration.approve")}
              </button>
            </div>
            <div className="competition-registrations__row competition-registrations__row--third">
              {registration.is_dropped ? t("competitions.registration.dropped") : t("competitions.registration.notDropped")}
              <button
                className="competition-registrations__button competition-registrations__button--exclude"
                onClick={() =>
                  onSubmit(Number(registration.user.id), competitionId, {
                    is_dropped: !registration.is_dropped,
                  })
                }
                disabled={isPending}
              >
                {registration.is_dropped ? t("competitions.registration.return") : t("competitions.registration.drop")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="competition-registrations">
      <button className="competition-registrations__button competition-registrations__button--open" onClick={openModal}>
        {t("competitions.registration.show")}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Registration Applications"
        className="competition-registrations__modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        <div className="competition-registrations__header">
          <h2 className="competition-registrations__title">
            {t("competitions.registration.title")}
          </h2>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={closeModal}
          >
            {t("competitions.registration.close")}
          </button>
        </div>
        {renderRegistrations()}
      </Modal>
    </div>
  );
};

export default CompetitionRegistrations;
