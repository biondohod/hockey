import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { useParams } from "react-router-dom";
import { useGetUserDocuments } from "../../lib/react-query/queries";
import ProfileDocumentItem from "./ProfileDocumentItem";
import EmptyContent from "../EmptyElement/EmptyElement";
import Loader from "../Loader/Loader";

type ProfileDocumentsType = {
  id: string;
};

const ProfileDocuments: FC<ProfileDocumentsType> = ({id}) => {
  // const { id } = useParams();
  const { data, isLoading } = useGetUserDocuments(id ? parseInt(id) : undefined);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { t } = useTranslation();

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

  useEffect(() => {
    if (data) setDocuments(data);
  }, [data]);

  const renderDocuments = () => {
    if (isLoading) return <Loader />;
    if (!documents.length) return <EmptyContent message={t("profile.documents.empty")}/>;
    return documents.map((document: IDocument) => (
      <ProfileDocumentItem document={document} key={document.id} />
    ));
  };


  return (
    <div className="profile-docs">
      <button className="profile-info__edit" onClick={openModal}>
        {t("profile.documents.view")}
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
            {t("profile.documents.title")}
          </h2>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={closeModal}
          >
            {t("competitions.registration.close")}
          </button>
        </div>
        <ul className="profile-docs__preview">
          {renderDocuments()}
        </ul>
      </ReactModal>
    </div>
  );
};

export default ProfileDocuments;
