import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useDeleteDocument } from "../../lib/react-query/mutations";

type ProfileDeleteDocumentItemProps = {
  id: number; 
};

const ProfileDeleteDocumentItem: FC<ProfileDeleteDocumentItemProps> = ({id}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { t } = useTranslation();
  const {mutateAsync, isPending} = useDeleteDocument();

  // const { mutateAsync, isPending } = useDeleteUser();

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
    toast.promise(mutateAsync(id), {
      pending: t("profile.documents.delete.pending"),
    });
    closeModal();
  };

  return (
    <div className="profile-delete profile-delete--document ">
      <button
        className="profile-delete__btn profile-delete__btn--open profile-delete__btn--document"
        onClick={openModal}
      >
        {t("profile.documents.delete.button")}
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
            {t("profile.documents.delete.text")}
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
            disabled={isPending}
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
}

export default ProfileDeleteDocumentItem