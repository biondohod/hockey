import React from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";

const ProfileDocuments = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { t } = useTranslation();

  return (
    <div className="competition-registrations">
      <button
        className="competition-registrations__button competition-registrations__button--open"
        onClick={openModal}
      >
        {t("competitions.registration.show")}
      </button>
      <ReactModal
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
      </ReactModal>
    </div>
  );
};

export default ProfileDocuments;
