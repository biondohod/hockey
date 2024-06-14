import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import "./ProfileDocuments.scss";

const ProfileDocuments = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 10485760,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
  };

  const hanleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit");
    // console.log(event.target);
    console.log(files);
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(e) {
        console.log(e.target?.result); // Logs the file data
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="profile-docs">
      <button className="profile-info__edit" onClick={openModal}>
        {t("profile.uploadDocs")}
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
            Загрузите ваши документы
          </h2>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={closeModal}
          >
            {t("competitions.registration.close")}
          </button>
        </div>
        <form onSubmit={hanleSubmit} className="profile-docs__form">
          {!files.length && (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} name="document" />
              <p>
                {isDragActive
                  ? "Отпустите файлы здесь, чтобы загрузить"
                  : "Drag 'n' drop some files here, or click to select files"}
              </p>
            </div>
          )}
          <ul className="profile-docs__preview">
            {files.map((file: File, index: number) => (
              <li key={index} className="profile-docs__item">
                {file.type.includes("image") ? (
                  <>
                    <span className="profile-docs__file-name">{file.name}</span>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="profile-docs__image"
                    />
                    <label className="profile-docs__label">
                      <span className="profile-docs__label-text">
                        Введите название документа
                      </span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Название документа"
                        defaultValue={file.name.split(".")[0]}
                        className="auth__input"
                        required={true}
                      />
                    </label>
                  </>
                ) : (
                  <p className="profile-docs__pdf">{file.name}</p>
                )}
                <div className="profile-docs__btns">
                  <button
                    className="profile-docs__btn profile-docs__btn--submit"
                    type="submit"
                  >
                    Upload document
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="profile-docs__btn profile-docs__btn--delete"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </form>
      </ReactModal>
    </div>
  );
};

export default ProfileDocuments;
