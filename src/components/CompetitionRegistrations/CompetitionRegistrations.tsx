import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import {
  useGetCompeitionRegistrations,
  useGetRoles,
} from "../../lib/react-query/queries";
import "./CompetitionRegistrations.scss";
import Loader from "../Loader/Loader";
import EmptyContent from "../EmptyElement/EmptyElement";
import { getUserRole } from "../../lib/utils";
import { toast } from "react-toastify";
import { useUpdateRegistration } from "../../lib/react-query/mutations";
import { Link } from "react-router-dom";

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
  const { data: roles } = useGetRoles();

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
      pending: "Подождите...",
    });
  };

  const renderRegistrations = () => {
    if (isLoading)
      return <Loader fontSize={24} loaderHeight={40} loaderWidth={40} />;
    if (isError) return <EmptyContent />;
    if (!data) return <EmptyContent />;
    return (
      <ul className="competition-registrations__list">
        {data.map((registration: ICompetitionRegistration, index: any) => (
          <li className="competition-registrations__item" key={index}>
            <div className="competition-registrations__row competition-registrations__row--first">
              <span className="competition-registrations__name">{`Name: ${registration.user.last_name} ${registration.user.first_name} ${registration.user.middle_name}`}</span>
              <Link to={`/profile/${registration.user.id}`} className="competition-registrations__link">Профиль игрока</Link>
              <span className="competition-registrations__email">{`Email: ${registration.user.email}`}</span>
              <span className="competition-registrations__role">{`Role: ${
                getUserRole(registration.user.role_id, roles)?.name
              }`}</span>
            </div>
            <div className="competition-registrations__row competition-registrations__row--second">
              {registration.is_approved
                ? "Подтвержден"
                : "Не подтвержден"}
              <button
                className="competition-registrations__button competition-registrations__button--approve"
                onClick={() =>
                  onSubmit(registration.user.id, competitionId, {
                    is_approved: !registration.is_approved,
                  })
                }
                disabled={isPending}
              >
                {registration.is_approved
                  ? "Отменить регистрацию"
                  : "Подтвердить регистрацию"}
              </button>
            </div>
            <div className="competition-registrations__row competition-registrations__row--third">
              {registration.is_dropped ? "Исключен" : "Не исключен"}
              <button
                className="competition-registrations__button competition-registrations__button--exclude"
                onClick={() =>
                  onSubmit(registration.user.id, competitionId, {
                    is_dropped: !registration.is_dropped,
                  })
                }
                disabled={isPending}
              >
                {registration.is_dropped ? "Отменить исключение" : "Исключить"}
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
        Показать заявки на регистрацию
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
            Заявки на регистрацию
          </h2>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={closeModal}
          >
            Закрыть
          </button>
        </div>
        {renderRegistrations()}
      </Modal>
    </div>
  );
};

export default CompetitionRegistrations;
