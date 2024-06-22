import { FC, useEffect, useState } from "react";
import "./DeleteProfileOrCompetition.scss";
import ReactModal from "react-modal";
import { useTranslation } from "react-i18next";
import { useDeleteCompetition, useDeleteUser } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";

type DeleteProfileOrCompetitionProps = {
  type: "profile" | "competition";
  competitionId?: number | undefined;
};

const DeleteProfileOrCompetition: FC<DeleteProfileOrCompetitionProps> = ({type, competitionId}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { t } = useTranslation();
  const { mutateAsync: deleteUser, isPending: isPendingDeleteUser } = useDeleteUser();
  const { mutateAsync: deleteCompetition, isPending: isPendingDeleteCompetition } = useDeleteCompetition();

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (modalIsOpen && root) {
      root.style.overflow = "hidden";
    } else if (root) {
      root.style.overflow = "auto";
    }
  }, [modalIsOpen]);

  const onDeleteUser = async () => {
    if (type === "profile") {      
      toast.promise(deleteUser(), {
        pending: t("profile.delete.pending"),
      });
    }
    if (type === "competition" && competitionId) {
    toast.promise(deleteCompetition(competitionId), {
      pending: t("competitions.delete.pending"),
    });
    closeModal();
  };
}

  return (
    <div className="profile-delete">
      <h2 className="profile-delete__title">{t("profile.delete.title")}</h2>
      <button
        className="profile-delete__btn profile-delete__btn--open"
        onClick={openModal}
      >
        {type === "profile" ? t("profile.delete.button") : t("competitions.delete.button")}
      </button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="competition-registrations__modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        <div className="competition-registrations__header">
          <h2 className="competition-registrations__title">
            {type === "profile" ? t("profile.delete.text") : t("competitions.delete.text")}
          </h2>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={closeModal}
          >
            {t("competitions.registration.close")}
          </button>
        </div>
        <div className="profile-delete__btns">
          <button
            className="profile-delete__btn profile-delete__btn--delete"
            onClick={onDeleteUser}
            disabled={isPendingDeleteCompetition || isPendingDeleteUser}
          >
            {t("profile.delete.confirm")}
          </button>
          <button
            className="profile-delete__btn profile-delete__btn--cancel"
            onClick={closeModal}
          >
            {t("profile.delete.cancel")}
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default DeleteProfileOrCompetition;
